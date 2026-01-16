import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

const STORAGE_KEY = "@ummat_calendar_reminders";
const CHANNEL_ID = "ummat_reminders_v2";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const ReminderService = {
  async requestPermissions() {
    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: "Calendar Alarms",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 500, 200, 500],
          lightColor: "#FF231F7C",
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
          audioAttributes: {
            usage: Notifications.AndroidAudioUsage.ALARM,
            contentType: Notifications.AndroidAudioContentType.SONIFICATION,
          },
        });
      }

      await Notifications.setNotificationCategoryAsync("alarm-actions", [
        {
          identifier: "DISMISS",
          buttonTitle: "OK",
          options: {
            isDestructive: true,
            opensAppToForeground: false,
          },
        },
        {
          identifier: "SNOOZE",
          buttonTitle: "Remind again",
          options: {
            opensAppToForeground: false,
          },
        },
      ]);

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === "granted";
    } catch (error) {
      console.warn("Notification permissions warning:", error);
      if (Constants.appOwnership === "expo") {
        return true;
      }
      return false;
    }
  },

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
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Notification permissions not granted");
      }

      const triggerDate = new Date(reminder.date);
      const id = Date.now();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.description,
          data: {
            id: id,
            snoozeMinutes: reminder.snoozeMinutes || 10,
          },
          categoryIdentifier: "alarm-actions",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: CHANNEL_ID,
        },
      });

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
        (r) => r.id === reminder.id
      );

      if (oldReminderIndex === -1) {
        throw new Error("Reminder not found");
      }

      const oldReminder = currentReminders[oldReminderIndex];
      if (oldReminder.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          oldReminder.notificationId
        );
      }

      const triggerDate = new Date(reminder.date);
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.description,
          data: {
            id: Date.now(),
            snoozeMinutes: reminder.snoozeMinutes || 10,
          },
          categoryIdentifier: "alarm-actions",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: CHANNEL_ID,
        },
      });

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
        await Notifications.cancelScheduledNotificationAsync(
          reminderToDelete.notificationId
        );
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
    console.log("Snoozing reminder...", originalContent.title);
    try {
      const { title, body, data } = originalContent;
      const snoozeMinutes =
        data && data.snoozeMinutes ? data.snoozeMinutes : 10;

      const triggerDate = new Date(Date.now() + snoozeMinutes * 60 * 1000);
      console.log("Scheduling snoozed notification for:", triggerDate);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${title} (Snoozed)`,
          body,
          data: { ...data },
          categoryIdentifier: "alarm-actions",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: CHANNEL_ID,
        },
      });
      console.log("Snooze scheduled successfully");

      if (data && data.id) {
        try {
          const currentReminders = await this.getReminders();
          const reminderIndex = currentReminders.findIndex(
            (r) =>
              r.id === data.id.toString() ||
              r.id === data.id ||
              (oldNotificationId && r.notificationId === oldNotificationId)
          );

          if (reminderIndex !== -1) {
            currentReminders[reminderIndex] = {
              ...currentReminders[reminderIndex],
              date: triggerDate.toISOString(),
              notificationId: notificationId,
            };
            await AsyncStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(currentReminders)
            );
            console.log("Updated snoozed reminder in storage");
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
    console.log("Rescheduling all reminders to clean up ghosts...");
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log("Cancelled all existing notifications.");

      const currentReminders = await this.getReminders();
      const now = new Date();
      const updatedReminders = [];
      let rescheduledCount = 0;

      for (const reminder of currentReminders) {
        const triggerDate = new Date(reminder.date);

        if (triggerDate > now) {
          const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: reminder.title,
              body: reminder.description,
              data: {
                id: reminder.id,
                snoozeMinutes: reminder.snoozeMinutes || 10,
              },
              categoryIdentifier: "alarm-actions",
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: triggerDate,
              channelId: CHANNEL_ID,
            },
          });

          updatedReminders.push({
            ...reminder,
            notificationId: notificationId,
          });
          rescheduledCount++;
        } else {
          updatedReminders.push({
            ...reminder,
            notificationId: null,
          });
        }
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReminders));
      console.log(`Rescheduled ${rescheduledCount} active reminders.`);
      return true;
    } catch (e) {
      console.error("Error rescheduling reminders", e);
      return false;
    }
  },

  initialize() {
    Notifications.addNotificationResponseReceivedListener(async (response) => {
      const actionIdentifier = response.actionIdentifier;
      const content = response.notification.request.content;
      const notificationId = response.notification.request.identifier;

      console.log(`Notification action received: ${actionIdentifier}`);

      try {
        await Notifications.dismissNotificationAsync(notificationId);
        console.log(`Notification ${notificationId} dismissed`);
      } catch (err) {
        console.warn("Failed to dismiss notification:", err);
      }

      if (actionIdentifier === "SNOOZE") {
        await this.snoozeReminder(content, notificationId);
      } else if (actionIdentifier === "DISMISS") {
        console.log("Notification dismissed via OK button");
      }
    });

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  },
};
