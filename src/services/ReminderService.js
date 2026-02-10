import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationManager from "./NotificationManager";
import { REMINDER_CONFIG, ALERT_TYPES } from "../constants/reminderConfig";

const { STORAGE_KEY } = REMINDER_CONFIG;

import { getAlertOffset } from "../utils/reminderUtils";

// const { STORAGE_KEY } = REMINDER_CONFIG; (keeping this line implicitly by only replacing what's needed)

export const ReminderService = {
  async getReminders() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];

      // Normalize legacy data in memory
      return data.map((r) => ({
        ...r,
        alerts: r.alerts || [ALERT_TYPES.AT_TIME],
        notificationIds:
          r.notificationIds || (r.notificationId ? [r.notificationId] : []),
      }));
    } catch (e) {
      console.error("Error reading reminders", e);
      return [];
    }
  },

  getChannelIdForSound(soundId) {
    const validSound =
      REMINDER_CONFIG.SOUNDS.find((s) => s.id === soundId) ||
      REMINDER_CONFIG.SOUNDS[0];
    return `${REMINDER_CONFIG.CHANNEL_PREFIX}${validSound.id}`;
  },

  async addReminder(reminder) {
    try {
      const hasPermission = await NotificationManager.requestPermissions();
      if (!hasPermission) {
        throw new Error("Notification permissions not granted");
      }

      const eventDate = new Date(reminder.date);
      const id = Date.now().toString();
      const alerts =
        reminder.alerts && reminder.alerts.length > 0
          ? reminder.alerts
          : [ALERT_TYPES.AT_TIME];

      const notificationIds = [];

      const channelId = this.getChannelIdForSound(reminder.soundId);

      for (const alertType of alerts) {
        const offset = getAlertOffset(alertType);
        const triggerDate = new Date(eventDate.getTime() - offset);

        // Don't schedule past alerts
        if (triggerDate > new Date()) {
          const notificationId = await NotificationManager.schedule(
            reminder.title,
            reminder.description,
            triggerDate,
            {
              id: id,
              snoozeMinutes: (reminder.snoozeMinutes || 10).toString(),
              soundId: reminder.soundId,
              originalAlert: alertType,
            },
            channelId,
          );
          notificationIds.push(notificationId);
        }
      }

      const newReminder = {
        ...reminder,
        id,
        alerts,
        notificationIds,
        // Remove legacy field support in new objects if possible, but keep for now if needed.
        // We will prefer using notificationIds.
        notificationId: null,
      };

      const currentReminders = await this.getReminders();
      // We need to store the raw object, getReminders handles normalization
      const updatedReminders = [...currentReminders, newReminder];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));

      return newReminder;
    } catch (e) {
      console.error("Error adding reminder", e);
      throw e;
    }
  },

  async updateReminder(reminder) {
    try {
      const currentReminders = await this.getReminders();
      const oldReminderIndex = currentReminders.findIndex(
        (r) => r.id === reminder.id,
      );

      if (oldReminderIndex === -1) {
        throw new Error("Reminder not found");
      }

      const oldReminder = currentReminders[oldReminderIndex];

      // Cancel all old notifications
      const idsToCancel = oldReminder.notificationIds || [];
      if (oldReminder.notificationId)
        idsToCancel.push(oldReminder.notificationId);

      for (const notifId of idsToCancel) {
        await NotificationManager.cancel(notifId);
      }

      // Schedule new ones
      const eventDate = new Date(reminder.date);
      const alerts =
        reminder.alerts && reminder.alerts.length > 0
          ? reminder.alerts
          : [ALERT_TYPES.AT_TIME];

      const newNotificationIds = [];

      const channelId = this.getChannelIdForSound(reminder.soundId);

      for (const alertType of alerts) {
        const offset = getAlertOffset(alertType);
        const triggerDate = new Date(eventDate.getTime() - offset);

        if (triggerDate > new Date()) {
          const notificationId = await NotificationManager.schedule(
            reminder.title,
            reminder.description,
            triggerDate,
            {
              id: reminder.id,
              snoozeMinutes: (reminder.snoozeMinutes || 10).toString(),
              soundId: reminder.soundId,
              originalAlert: alertType,
            },
            channelId,
          );
          newNotificationIds.push(notificationId);
        }
      }

      const updatedReminder = {
        ...reminder,
        alerts,
        notificationIds: newNotificationIds,
        notificationId: null,
      };

      const updatedReminders = [...currentReminders];
      updatedReminders[oldReminderIndex] = updatedReminder;

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));

      return updatedReminder;
    } catch (e) {
      console.error("Error updating reminder", e);
      throw e;
    }
  },

  async deleteReminder(id) {
    try {
      const currentReminders = await this.getReminders();
      const reminderToDelete = currentReminders.find((r) => r.id === id);

      if (reminderToDelete) {
        const idsToCancel = reminderToDelete.notificationIds || [];
        if (reminderToDelete.notificationId)
          idsToCancel.push(reminderToDelete.notificationId);

        for (const notifId of idsToCancel) {
          await NotificationManager.cancel(notifId);
        }
      }

      const updatedReminders = currentReminders.filter((r) => r.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));
      return true;
    } catch (e) {
      console.error("Error deleting reminder", e);
      return false;
    }
  },

  async snoozeReminder(originalContent, oldNotificationId) {
    try {
      const { title, body, data } = originalContent;
      const snoozeMinutes =
        data && data.snoozeMinutes ? parseInt(data.snoozeMinutes) : 10;
      // Use the soundID from the original data if available, or default
      const soundId = data && data.soundId ? data.soundId : "default";

      // 1. Fetch current reminder to check config
      let reminder = null;
      if (data && data.id) {
        const currentReminders = await this.getReminders();
        reminder = currentReminders.find(
          (r) => r.id === data.id.toString() || r.id === data.id,
        );
      }

      // Check for "Smart Snooze" condition:
      // Single alert && it is "at_time"
      const isSingleAtTimeAlert =
        reminder &&
        reminder.alerts &&
        reminder.alerts.length === 1 &&
        reminder.alerts[0] === ALERT_TYPES.AT_TIME;

      // 2. Logic Branch
      if (isSingleAtTimeAlert) {
        // BRANCH A: Shift the Event Time
        const oldDate = new Date(reminder.date);
        const newDate = new Date(oldDate.getTime() + snoozeMinutes * 60 * 1000);

        const updatedReminder = {
          ...reminder,
          date: newDate.toISOString(),
          // Ensure we keep soundId and other props
        };

        // This will cancel old notifs and schedule new ones at the new time
        await this.updateReminder(updatedReminder);

        return true;
      } else {
        // BRANCH B: Standard Snooze (Temporary Notification)
        // Applies for: Multile alerts, or Pre-event alerts (1 day before etc)
        const triggerDate = new Date(Date.now() + snoozeMinutes * 60 * 1000);
        const channelId = this.getChannelIdForSound(soundId);

        const notificationId = await NotificationManager.schedule(
          `${title} (Snoozed)`,
          body,
          triggerDate,
          { ...data, isSnooze: true },
          channelId,
        );

        // Track this ID in the original reminder without changing event time
        if (reminder) {
          try {
            // Re-fetch to be safe or use current reference
            const currentReminders = await this.getReminders();
            const listIndex = currentReminders.findIndex(
              (r) => r.id === reminder.id,
            );

            if (listIndex !== -1) {
              const targetReminder = currentReminders[listIndex];
              const updatedIds = [...(targetReminder.notificationIds || [])];
              updatedIds.push(notificationId);

              currentReminders[listIndex] = {
                ...targetReminder,
                notificationIds: updatedIds,
              };
              await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(currentReminders),
              );
            }
          } catch (storageError) {
            console.error("Error updating storage for snooze ID", storageError);
          }
        }
        return true;
      }
    } catch (e) {
      console.error("Error snoozing reminder", e);
      return false;
    }
  },

  async rescheduleAllReminders() {
    try {
      await NotificationManager.cancelAll();

      const currentReminders = await this.getReminders();
      // normalize happens in getReminders, so these have alerts array
      const now = new Date();
      const updatedReminders = [];

      for (const reminder of currentReminders) {
        const eventDate = new Date(reminder.date);
        const alerts = reminder.alerts || [ALERT_TYPES.AT_TIME];
        const newNotificationIds = [];

        // Determine channel for this reminder
        const channelId = this.getChannelIdForSound(reminder.soundId);

        for (const alertType of alerts) {
          const offset = getAlertOffset(alertType);
          const triggerDate = new Date(eventDate.getTime() - offset);

          if (triggerDate > now) {
            const notificationId = await NotificationManager.schedule(
              reminder.title,
              reminder.description,
              triggerDate,
              {
                id: reminder.id,
                snoozeMinutes: (reminder.snoozeMinutes || 10).toString(),
                originalAlert: alertType,
              },
              channelId,
            );
            newNotificationIds.push(notificationId);
          }
        }

        updatedReminders.push({
          ...reminder,
          alerts,
          notificationIds: newNotificationIds,
          notificationId: null,
        });
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));
      return true;
    } catch (e) {
      console.error("Error rescheduling reminders", e);
      return false;
    }
  },

  initialize() {
    NotificationManager.addResponseListener(async (response) => {
      const actionIdentifier = response.actionIdentifier;
      const content = response.notification.request.content;
      const notificationId = response.notification.request.identifier;

      try {
        await NotificationManager.dismiss(notificationId);
      } catch (err) {
        console.warn("Failed to dismiss notification:", err);
      }

      if (actionIdentifier === "SNOOZE") {
        await this.snoozeReminder(content, notificationId);
      }
    });

    // Ensure permissions are requested/channels set up on init
    NotificationManager.requestPermissions();
  },
};
