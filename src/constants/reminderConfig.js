import * as Notifications from "expo-notifications";

export const REMINDER_CONFIG = {
  STORAGE_KEY: "@ummat_calendar_reminders",
  CHANNEL_ID: "ummat_reminders_v6",
  CHANNEL_NAME: "Calendar Alarms",
  ACTION_CATEGORY: "alarm-actions",

  CHANNEL_SETTINGS: {
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 500, 200, 500],
    lightColor: "#FF231F7C",
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
      contentType: Notifications.AndroidAudioContentType.SONIFICATION,
    },
  },

  ACTIONS: [
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
  ],
};
