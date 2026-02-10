import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
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
        // Create a channel for each sound option
        for (const sound of REMINDER_CONFIG.SOUNDS) {
          // Filename without extension for Android resource
          const resourceName = sound.filename.split(".")[0];
          const channelId = `${REMINDER_CONFIG.CHANNEL_PREFIX}${sound.id}`;

          await Notifications.setNotificationChannelAsync(channelId, {
            name: `${REMINDER_CONFIG.CHANNEL_NAME} - ${sound.label}`,
            sound: resourceName,
            ...REMINDER_CONFIG.BASE_CHANNEL_SETTINGS,
          });
        }
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

  async schedule(
    title,
    body,
    triggerDate,
    data = {},
    channelId = null,
    identifier = null,
  ) {
    try {
      // Default to the 'default' sound channel if none provided
      const targetChannelId = channelId || REMINDER_CONFIG.DEFAULT_CHANNEL_ID;

      const trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: targetChannelId,
      };

      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          categoryIdentifier: REMINDER_CONFIG.ACTION_CATEGORY,
        },
        trigger,
        identifier,
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
