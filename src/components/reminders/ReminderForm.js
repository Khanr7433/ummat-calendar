import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TOPOGRAPHY } from "../../constants/typography";
import { COLORS } from "../../constants/colors";
import { ALERT_TYPES } from "../../constants/reminderConfig";
import AppButton from "../ui/AppButton";
import AppInput from "../ui/AppInput";
import DateTimeSection from "./DateTimeSection";
import AlertsSection from "./AlertsSection";
import SnoozeSection from "./SnoozeSection";
import SoundSelector from "./SoundSelector";

export default function ReminderForm({
  initialData,
  onSave,
  onCancel,
  hasUnsavedChangesRef,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [snoozeMinutes, setSnoozeMinutes] = useState(10);
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState("date");
  const [selectedAlerts, setSelectedAlerts] = useState([ALERT_TYPES.AT_TIME]);
  const [customDays, setCustomDays] = useState("1");
  const [soundId, setSoundId] = useState("default");

  const soundSelectorRef = React.useRef(null);

  const handleInteraction = () => {
    if (soundSelectorRef.current) {
      soundSelectorRef.current.stopPreview();
    }
  };

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

  // Update parent ref for unsaved changes check
  useEffect(() => {
    if (hasUnsavedChangesRef) {
      const isDirty = checkIsDirty();
      hasUnsavedChangesRef.current = isDirty;
    }
  }, [title, description, date, snoozeMinutes, selectedAlerts, customDays]);

  const checkIsDirty = () => {
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
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    // Precision Fix: Zero out seconds
    const scheduledDate = new Date(date);
    scheduledDate.setSeconds(0);
    scheduledDate.setMilliseconds(0);

    onSave({
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
    });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
    handleInteraction();
  };

  const showMode = (currentMode) => {
    handleInteraction();
    setShowPicker(true);
    setMode(currentMode);
  };

  const handleToggleAlert = (optionId) => {
    handleInteraction();
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.formContainer}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        onScrollBeginDrag={handleInteraction}
        nestedScrollEnabled={true}
      >
        <AppInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Read Surah Yaseen"
          onFocus={handleInteraction}
        />

        <AppInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add details..."
          multiline
          onFocus={handleInteraction}
        />

        <Text style={styles.sectionHeader}>When should we remind you?</Text>
        <DateTimeSection
          date={date}
          onDatePress={() => showMode("date")}
          onTimePress={() => showMode("time")}
        />

        {showPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={false}
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.sectionHeader}>Notification Time</Text>
        <AlertsSection
          selectedAlerts={selectedAlerts}
          onToggleAlert={handleToggleAlert}
          customDays={customDays}
          onCustomDaysChange={handleCustomDaysChange}
        />

        <Text style={styles.sectionHeader}>Snooze Duration</Text>
        <SnoozeSection
          snoozeMinutes={snoozeMinutes}
          onSelect={(val) => {
            setSnoozeMinutes(val);
            handleInteraction();
          }}
        />

        <Text style={styles.sectionHeader}>Reminder Sound</Text>
        <SoundSelector
          ref={soundSelectorRef}
          selectedSoundId={soundId}
          onSelect={setSoundId}
        />
      </ScrollView>

      <View style={styles.formActions}>
        <AppButton title="Cancel" onPress={onCancel} variant="secondary" />
        <View style={{ width: 16 }} />
        <AppButton
          title={initialData ? "Update Reminder" : "Set Reminder"}
          onPress={handleSave}
          variant="primary"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingTop: 8,
  },
  sectionHeader: {
    ...TOPOGRAPHY.label,
    marginTop: 24,
    marginBottom: 12,
  },
  formActions: {
    flexDirection: "row",
    marginTop: "auto",
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
});
