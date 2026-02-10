import { useState, useEffect, useCallback } from "react";
import { ALERT_TYPES } from "../constants/reminderConfig";

export const useReminderForm = (initialData, hasUnsavedChangesRef) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [snoozeMinutes, setSnoozeMinutes] = useState(10);
  const [selectedAlerts, setSelectedAlerts] = useState([ALERT_TYPES.AT_TIME]);
  const [customDays, setCustomDays] = useState("1");
  const [soundId, setSoundId] = useState("default");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setDate(new Date(initialData.date));
      setSnoozeMinutes(initialData.snoozeMinutes || 10);
      setSoundId(initialData.soundId || "default");

      // Parse initial alerts
      let alerts = initialData.alerts || [ALERT_TYPES.AT_TIME];
      setSelectedAlerts(alerts);

      const customAlert = alerts.find((a) =>
        a.startsWith(ALERT_TYPES.CUSTOM_PREFIX),
      );
      if (customAlert) {
        setCustomDays(customAlert.split(":")[1]);
      }
    }
  }, [initialData]);

  const checkIsDirty = useCallback(() => {
    if (!initialData) {
      return title.trim().length > 0 || description.trim().length > 0;
    }
    const isTitleChanged = title !== initialData.title;
    const isDescChanged = description !== (initialData.description || "");
    const isDateChanged =
      date.getTime() !== new Date(initialData.date).getTime();
    const isSnoozeChanged = snoozeMinutes !== (initialData.snoozeMinutes || 10);
    const isSoundChanged = soundId !== (initialData.soundId || "default");

    // Check alerts change
    const initialAlerts = initialData.alerts || [ALERT_TYPES.AT_TIME];
    const isAlertsChanged =
      JSON.stringify(selectedAlerts.sort()) !==
      JSON.stringify(initialAlerts.sort());

    // Check custom days change if custom is selected
    const initialCustom =
      initialAlerts
        .find((a) => a.startsWith(ALERT_TYPES.CUSTOM_PREFIX))
        ?.split(":")[1] || "1";
    const isCustomChanged =
      selectedAlerts.some((a) => a.startsWith(ALERT_TYPES.CUSTOM_PREFIX)) &&
      customDays !== initialCustom;

    return (
      isTitleChanged ||
      isDescChanged ||
      isDateChanged ||
      isSnoozeChanged ||
      isAlertsChanged ||
      isCustomChanged ||
      isSoundChanged
    );
  }, [
    initialData,
    title,
    description,
    date,
    snoozeMinutes,
    soundId,
    selectedAlerts,
    customDays,
  ]);

  // Update parent ref for unsaved changes check
  useEffect(() => {
    if (hasUnsavedChangesRef) {
      hasUnsavedChangesRef.current = checkIsDirty();
    }
  }, [checkIsDirty, hasUnsavedChangesRef]);

  const handleToggleAlert = (optionId) => {
    if (optionId === ALERT_TYPES.AT_TIME) {
      const isSelected = selectedAlerts.includes(optionId);
      if (isSelected && selectedAlerts.length === 1) return;
    }

    setSelectedAlerts((prev) => {
      if (optionId === ALERT_TYPES.CUSTOM) {
        const customIndex = prev.findIndex((a) =>
          a.startsWith(ALERT_TYPES.CUSTOM_PREFIX),
        );
        if (customIndex >= 0) {
          return prev.filter((_, i) => i !== customIndex);
        } else {
          return [...prev, `${ALERT_TYPES.CUSTOM_PREFIX}${customDays}`];
        }
      }

      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleCustomDaysChange = (numeric) => {
    setCustomDays(numeric);
    setSelectedAlerts((prev) =>
      prev.map((a) =>
        a.startsWith(ALERT_TYPES.CUSTOM_PREFIX)
          ? `${ALERT_TYPES.CUSTOM_PREFIX}${numeric}`
          : a,
      ),
    );
  };

  const getFormData = () => {
    // Precision Fix: Zero out seconds
    const scheduledDate = new Date(date);
    scheduledDate.setSeconds(0);
    scheduledDate.setMilliseconds(0);

    return {
      title,
      description,
      date: scheduledDate.toISOString(),
      snoozeMinutes,
      soundId,
      alerts: selectedAlerts.map((a) =>
        a === ALERT_TYPES.CUSTOM
          ? `${ALERT_TYPES.CUSTOM_PREFIX}${customDays}`
          : a,
      ),
    };
  };

  return {
    state: {
      title,
      description,
      date,
      snoozeMinutes,
      selectedAlerts,
      customDays,
      soundId,
    },
    actions: {
      setTitle,
      setDescription,
      setDate,
      setSnoozeMinutes,
      setSoundId,
      handleToggleAlert,
      handleCustomDaysChange,
      checkIsDirty,
      getFormData,
    },
  };
};
