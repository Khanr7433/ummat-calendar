import React, { createContext, useState, useContext, useCallback } from "react";
import calendarData from "../data/calendarData";

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

  const value = {
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
    setCurrentMonthIndex, // Exposed for direct syncing with FlatList scroll events

    // Actions
    toggleFlip,
    setMonthIndex,
    openMonthSelector,
    closeMonthSelector,
    openSettings,
    closeSettings,
    openReminders,
    closeReminders,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
