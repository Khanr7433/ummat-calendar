import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import calendarData from "../data/calendarData";
import DailyNotificationService from "../services/DailyNotificationService";
import DateService from "../services/DateService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Calendar State
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const initialMonthIndex = currentYear >= 2026 ? currentDate.getMonth() : 0;

  const [currentMonthIndex, setCurrentMonthIndex] = useState(initialMonthIndex);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const [showBack, setShowBack] = useState(false);

  // Modals Visibility State
  const [isMonthSelectorVisible, setMonthSelectorVisible] = useState(false);
  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [isRemindersVisible, setRemindersVisible] = useState(false);

  // Daily Notification State
  const [dailyNotificationSettings, setDailyNotificationSettings] = useState({
    isEnabled: true, // Always enabled
    date: new Date().setHours(8, 0, 0, 0), // Default 8 AM
    useLocation: false,
  });

  // Header Date State
  const [headerDate, setHeaderDate] = useState(() => {
    const today = new Date();
    return {
      hijri: DateService.getOfflineHijriDate(today),
      gregorian: today.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  });

  // Load settings and date on mount
  useEffect(() => {
    const loadData = async () => {
      // 1. Load Settings
      await DailyNotificationService.loadSettings();
      setDailyNotificationSettings({
        isEnabled: DailyNotificationService.isEnabled,
        date: new Date().setHours(
          DailyNotificationService.notificationTime.hour,
          DailyNotificationService.notificationTime.minute,
        ),
        useLocation: DailyNotificationService.useLocation,
      });

      // 2. Load Header Date
      // Always try to use location for correctness as per requirements
      const dateData = await DateService.getDateData(new Date(), true);
      setHeaderDate(dateData);
    };
    loadData();
  }, []);

  // Actions
  const toggleFlip = useCallback(() => setShowBack((prev) => !prev), []);

  const setMonthIndex = useCallback((index) => {
    if (index >= 0 && index < calendarData.length) {
      setCurrentMonthIndex(index);
    }
  }, []);

  const openMonthSelector = useCallback(
    () => setMonthSelectorVisible(true),
    [],
  );
  const closeMonthSelector = useCallback(
    () => setMonthSelectorVisible(false),
    [],
  );

  const openSettings = useCallback(() => setSettingsVisible(true), []);
  const closeSettings = useCallback(() => setSettingsVisible(false), []);

  const openReminders = useCallback(() => setRemindersVisible(true), []);
  const closeReminders = useCallback(() => setRemindersVisible(false), []);

  const updateDailyNotificationSettings = async (settings) => {
    const newSettings = { ...dailyNotificationSettings, ...settings };
    setDailyNotificationSettings(newSettings);

    const date = new Date(newSettings.date);
    await DailyNotificationService.saveSettings(
      newSettings.isEnabled,
      { hour: date.getHours(), minute: date.getMinutes() },
      newSettings.useLocation,
    );
  };

  const value = React.useMemo(
    () => ({
      // State
      currentMonthIndex,
      isScrollEnabled,
      showBack,
      isMonthSelectorVisible,
      isSettingsVisible,
      isRemindersVisible,
      calendarData,

      // Setters
      setIsScrollEnabled,
      setCurrentMonthIndex,

      // Actions
      toggleFlip,
      setMonthIndex,
      openMonthSelector,
      closeMonthSelector,
      openSettings,
      closeSettings,
      openReminders,
      closeReminders,
      dailyNotificationSettings,
      updateDailyNotificationSettings,
      headerDate,
    }),
    [
      currentMonthIndex,
      isScrollEnabled,
      showBack,
      isMonthSelectorVisible,
      isSettingsVisible,
      isRemindersVisible,
      dailyNotificationSettings,
      headerDate,
      toggleFlip,
      setMonthIndex,
      openMonthSelector,
      closeMonthSelector,
      openSettings,
      closeSettings,
      openReminders,
      closeReminders,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
