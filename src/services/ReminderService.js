import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

const STORAGE_KEY = "@ummat_calendar_reminders";
const CHANNEL_ID = "ummat_reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const ReminderService = {
  async requestPermissions() {
    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: "Calendar Reminders",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

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
      const now = new Date();
      const diff = triggerDate.getTime() - now.getTime();
      const seconds = Math.max(2, Math.floor(diff / 1000));

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: reminder.title,
          body: reminder.description,
          data: { id: Date.now() },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: seconds,
          channelId: CHANNEL_ID,
          repeats: false,
        },
      });

      const newReminder = {
        id: Date.now().toString(),
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
};
