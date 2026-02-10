import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TOPOGRAPHY } from "../../constants/typography";
import { COLORS } from "../../constants/colors";
import AppButton from "../ui/AppButton";
import AppInput from "../ui/AppInput";
import DateTimeSection from "./DateTimeSection";
import AlertsSection from "./AlertsSection";
import SnoozeSection from "./SnoozeSection";
import SoundSelector from "./SoundSelector";

import { useReminderForm } from "../../hooks/useReminderForm";

export default function ReminderForm({
  initialData,
  onSave,
  onCancel,
  hasUnsavedChangesRef,
}) {
  const { state, actions } = useReminderForm(initialData, hasUnsavedChangesRef);

  const {
    title,
    description,
    date,
    snoozeMinutes,
    selectedAlerts,
    customDays,
    soundId,
  } = state;

  const {
    setTitle,
    setDescription,
    setDate,
    setSnoozeMinutes,
    setSoundId,
    handleToggleAlert,
    handleCustomDaysChange,
    getFormData,
  } = actions;

  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState("date");
  const soundSelectorRef = React.useRef(null);

  const handleInteraction = () => {
    if (soundSelectorRef.current) {
      soundSelectorRef.current.stopPreview();
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    onSave(getFormData());
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
          onToggleAlert={(id) => {
            handleInteraction();
            handleToggleAlert(id);
          }}
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
