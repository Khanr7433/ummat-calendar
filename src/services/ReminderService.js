import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationManager from "./NotificationManager";
import { REMINDER_CONFIG } from "../constants/reminderConfig";

const { STORAGE_KEY } = REMINDER_CONFIG;

export const ReminderService = {
  async getReminders() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
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

      const triggerDate = new Date(reminder.date);
      const id = Date.now();

      const notificationId = await NotificationManager.schedule(
        reminder.title,
        reminder.description,
        triggerDate,
        {
          id: id.toString(),
          snoozeMinutes: (reminder.snoozeMinutes || 10).toString(),
        },
      );

      const newReminder = {
        id: id.toString(),
        notificationId,
        ...reminder,
      };

      const currentReminders = await this.getReminders();
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
      if (oldReminder.notificationId) {
        await NotificationManager.cancel(oldReminder.notificationId);
      }

      const triggerDate = new Date(reminder.date);
      const notificationId = await NotificationManager.schedule(
        reminder.title,
        reminder.description,
        triggerDate,
        {
          id: Date.now().toString(),
          snoozeMinutes: (reminder.snoozeMinutes || 10).toString(),
        },
      );

      const updatedReminder = {
        ...reminder,
        notificationId,
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

      if (reminderToDelete && reminderToDelete.notificationId) {
        await NotificationManager.cancel(reminderToDelete.notificationId);
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
        data && data.snoozeMinutes ? data.snoozeMinutes : 10;

      const triggerDate = new Date(Date.now() + snoozeMinutes * 60 * 1000);

      const notificationId = await NotificationManager.schedule(
        `${title} (Snoozed)`,
        body,
        triggerDate,
        { ...data },
      );

      if (data && data.id) {
        try {
          const currentReminders = await this.getReminders();
          const reminderIndex = currentReminders.findIndex(
            (r) =>
              r.id === data.id.toString() ||
              r.id === data.id ||
              (oldNotificationId && r.notificationId === oldNotificationId),
          );

          if (reminderIndex !== -1) {
            currentReminders[reminderIndex] = {
              ...currentReminders[reminderIndex],
              date: triggerDate.toISOString(),
              notificationId: notificationId,
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
      const now = new Date();
      const updatedReminders = [];

      for (const reminder of currentReminders) {
        const triggerDate = new Date(reminder.date);

        if (triggerDate > now) {
          const notificationId = await NotificationManager.schedule(
            reminder.title,
            reminder.description,
            triggerDate,
            {
              id: reminder.id.toString(),
              snoozeMinutes: (reminder.snoozeMinutes || 10).toString(),
            },
          );

          updatedReminders.push({
            ...reminder,
            notificationId: notificationId,
          });
        } else {
          updatedReminders.push({
            ...reminder,
            notificationId: null,
          });
        }
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
