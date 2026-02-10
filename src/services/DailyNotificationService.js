import NotificationManager from "./NotificationManager";
import DateService from "./DateService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DAILY_NOTIFICATION_ID_PREFIX = "daily_date_notification_";
const SETTINGS_KEY = "daily_notification_settings";

class DailyNotificationService {
  constructor() {
    this.isEnabled = true;
    this.notificationTime = { hour: 8, minute: 0 };
    this.useLocation = true;
  }

  async loadSettings() {
    try {
      const json = await AsyncStorage.getItem(SETTINGS_KEY);
      if (json) {
        const settings = JSON.parse(json);
        this.isEnabled = true;
        this.notificationTime = settings.notificationTime;
        this.useLocation = true;
      }
    } catch (error) {
      console.warn("Error loading daily notification settings:", error);
    }
  }

  async saveSettings(isEnabled, notificationTime, useLocation) {
    try {
      this.isEnabled = isEnabled;
      this.notificationTime = notificationTime;
      this.useLocation = useLocation;
      await AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ isEnabled, notificationTime, useLocation }),
      );

      if (isEnabled) {
        await this.scheduleDailyNotifications();
      } else {
        await this.cancelDailyNotifications();
      }
    } catch (error) {
      console.warn("Error saving daily notification settings:", error);
    }
  }

  async cancelDailyNotifications() {
    // Cancel next 30 days
    // Since we use deterministic IDs, we can cancel them explicitly if needed,
    // or just rely on the fact that we won't reschedule them.
    // However, clean up is better.
    const today = new Date();
    for (let i = 0; i < 35; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      const id = `${DAILY_NOTIFICATION_ID_PREFIX}${dateString}`;
      await NotificationManager.cancel(id);
    }
  }

  async scheduleDailyNotifications() {
    if (!this.isEnabled) return;

    // We schedule for the next 30 days to ensure coverage
    const today = new Date();

    // We request permissions again just to be safe/ensure correct state
    const hasPermission = await NotificationManager.requestPermissions();
    if (!hasPermission) {
      console.warn("No notification permission for daily notifications");
      return;
    }

    for (let i = 0; i < 30; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      // Set time
      targetDate.setHours(
        this.notificationTime.hour,
        this.notificationTime.minute,
        0,
        0,
      );

      // If the time for today has already passed, skip today
      if (targetDate < new Date()) {
        continue;
      }

      // Fetch Date Data
      const { gregorian, hijri } = await DateService.getDateData(
        targetDate,
        this.useLocation,
      );

      const title = "Daily Date";
      const body = `Today is ${hijri} | ${gregorian}`;
      const dateString = targetDate.toISOString().split("T")[0];
      const id = `${DAILY_NOTIFICATION_ID_PREFIX}${dateString}`;

      // Schedule
      await NotificationManager.schedule(
        title,
        body,
        targetDate,
        { type: "daily_date" },
        null, // default channel
        id,
      );
    }
  }

  async refresh() {
    await this.loadSettings();
    if (this.isEnabled) {
      await this.scheduleDailyNotifications();
    }
  }
}

export default new DailyNotificationService();
