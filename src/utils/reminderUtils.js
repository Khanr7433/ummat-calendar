import { ALERT_TYPES } from "../constants/reminderConfig";

export const getAlertOffset = (alertType) => {
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

export const getAlertLabel = (alert) => {
  if (alert === ALERT_TYPES.AT_TIME) return "At time";
  if (alert === ALERT_TYPES.ONE_DAY_BEFORE) return "1 day before";
  if (alert === ALERT_TYPES.TWO_DAYS_BEFORE) return "2 days before";
  if (alert === ALERT_TYPES.ONE_WEEK_BEFORE) return "1 week before";
  if (alert.startsWith(ALERT_TYPES.CUSTOM_PREFIX))
    return `${alert.split(":")[1]} days before`;
  return "";
};

export const sortReminders = (reminders) => {
  const now = new Date();
  return [...reminders].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    const isExpiredA = dateA < now;
    const isExpiredB = dateB < now;

    if (isExpiredA === isExpiredB) {
      return dateA - dateB;
    }
    return isExpiredA ? 1 : -1;
  });
};

export const formatReminderTime = (date) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
