import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { REMINDER_CONFIG } from "../constants/reminderConfig";

class NotificationManager {
  constructor() {
    this.configureHandler();
  }

  configureHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  async requestPermissions() {
    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
          REMINDER_CONFIG.CHANNEL_ID,
          {
            name: REMINDER_CONFIG.CHANNEL_NAME,
            ...REMINDER_CONFIG.CHANNEL_SETTINGS,
          },
        );
      }

      await Notifications.setNotificationCategoryAsync(
        REMINDER_CONFIG.ACTION_CATEGORY,
        REMINDER_CONFIG.ACTIONS,
      );

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
      return false;
    }
  }

  async schedule(title, body, triggerDate, data = {}) {
    try {
      const trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate.getTime(),
        channelId: REMINDER_CONFIG.CHANNEL_ID,
      };

      console.log("[NotificationManager] Scheduling:", {
        title,
        triggerDate: triggerDate.toISOString(),
        timestamp: trigger.date,
      });

      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          categoryIdentifier: REMINDER_CONFIG.ACTION_CATEGORY,
        },
        trigger,
      });
    } catch (error) {
      console.error("[NotificationManager] Schedule Failed:", error);
      const errorMsg =
        typeof error === "object"
          ? JSON.stringify(error, Object.getOwnPropertyNames(error))
          : String(error);

      throw new Error(`Failed to schedule: ${errorMsg}`);
    }
  }

  async cancel(notificationId) {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  }

  async cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async dismiss(notificationId) {
    if (notificationId) {
      await Notifications.dismissNotificationAsync(notificationId);
    }
  }

  addResponseListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}

export default new NotificationManager();
