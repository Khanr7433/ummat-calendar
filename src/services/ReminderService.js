import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationManager from "./NotificationManager";
import { REMINDER_CONFIG, ALERT_TYPES } from "../constants/reminderConfig";

const { STORAGE_KEY } = REMINDER_CONFIG;

const getAlertOffset = (alertType) => {
  if (alertType === ALERT_TYPES.AT_TIME) return 0;
  if (alertType === ALERT_TYPES.ONE_DAY_BEFORE) return 24 * 60 * 60 * 1000;
  if (alertType === ALERT_TYPES.TWO_DAYS_BEFORE) return 48 * 60 * 60 * 1000;
  if (alertType === ALERT_TYPES.ONE_WEEK_BEFORE) return 7 * 24 * 60 * 60 * 1000;
  if (alertType.startsWith(ALERT_TYPES.CUSTOM_PREFIX)) {
    const days = parseInt(alertType.split(":")[1], 10);
    return days * 24 * 60 * 60 * 1000;
  }
  return 0;
};

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
              originalAlert: alertType,
            },
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
              originalAlert: alertType,
            },
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

      const triggerDate = new Date(Date.now() + snoozeMinutes * 60 * 1000);

      const notificationId = await NotificationManager.schedule(
        `${title} (Snoozed)`,
        body,
        triggerDate,
        { ...data, isSnooze: true },
      );

      // We do NOT update the event date. We just track this extra notification ID.
      if (data && data.id) {
        try {
          const currentReminders = await this.getReminders();
          const reminderIndex = currentReminders.findIndex(
            (r) => r.id === data.id.toString() || r.id === data.id,
          );

          if (reminderIndex !== -1) {
            const reminder = currentReminders[reminderIndex];
            const updatedIds = [...(reminder.notificationIds || [])];
            updatedIds.push(notificationId);

            currentReminders[reminderIndex] = {
              ...reminder,
              notificationIds: updatedIds,
            };
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(currentReminders),
            );
          }
        } catch (storageError) {
          console.error("Error updating storage for snooze", storageError);
        }
      }

      return true;
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
