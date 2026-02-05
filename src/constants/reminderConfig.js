import * as Notifications from "expo-notifications";

export const REMINDER_CONFIG = {
  STORAGE_KEY: "@ummat_calendar_reminders",
  SOUND_PREF_KEY: "@ummat_calendar_sound_pref",
  DEFAULT_CHANNEL_ID: "ummat_reminders_default", // Fallback
  CHANNEL_NAME: "Calendar Alarms",
  ACTION_CATEGORY: "alarm-actions",

  SOUNDS: [
    { id: "default", label: "Classic Alarm", filename: "alarm_clock.ogg" },
    {
      id: "digital",
      label: "Digital Watch",
      filename: "digital_watch_alarm_long.ogg",
    },
    {
      id: "mechanical",
      label: "Mechanical Clock",
      filename: "mechanical_clock_ring.ogg",
    },
    {
      id: "bell",
      label: "Bell Ringing",
      filename: "medium_bell_ringing_near.ogg",
    },
    { id: "spaceship", label: "Spaceship", filename: "spaceship_alarm.ogg" },
  ],

  BASE_CHANNEL_SETTINGS: {
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

export const ALERT_TYPES = {
  AT_TIME: "at_time",
  ONE_DAY_BEFORE: "1_day_before",
  TWO_DAYS_BEFORE: "2_days_before",
  ONE_WEEK_BEFORE: "1_week_before",
  CUSTOM_PREFIX: "custom:",
  CUSTOM: "custom",
};

export const ALERT_OPTIONS = [
  { id: ALERT_TYPES.AT_TIME, label: "At time of event" },
  { id: ALERT_TYPES.ONE_DAY_BEFORE, label: "1 day before" },
  { id: ALERT_TYPES.TWO_DAYS_BEFORE, label: "2 days before" },
  { id: ALERT_TYPES.ONE_WEEK_BEFORE, label: "1 week before" },
  { id: ALERT_TYPES.CUSTOM, label: "Custom" },
];

export const SNOOZE_OPTIONS = [5, 10, 15, 30];
