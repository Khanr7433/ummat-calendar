export const APP_CONFIG = {
  // API Configuration
  HIJRI_API_BASE: "https://api.aladhan.com/v1/gToHCalendar",

  // Storage Keys
  SHARED_PREFS_NAME: "react-native",
  CACHE_KEY_PREFIX: "gtoh_cal_kara_v4_",

  // Widget Keys
  WIDGET_KEYS: {
    TOP_DATE: "widget_top_date",
    HIJRI_DATE: "widget_hijri_date",
  },

  // Location Configuration (For Moon Sighting alignment)
  LOCATION: {
    // Forced Location: New Delhi, India
    LATITUDE: 28.6139,
    LONGITUDE: 77.209,
    METHOD: 1, // University of Islamic Sciences, Karachi
  },

  // Background Tasks
  TASKS: {
    BACKGROUND_DATE_SYNC: "BACKGROUND_DATE_SYNC",
  },
};
