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
import { Ionicons } from "@expo/vector-icons";
import { TOPOGRAPHY } from "../../constants/typography";
import { COLORS } from "../../constants/colors";
import AppButton from "../ui/AppButton";
import AppInput from "../ui/AppInput";

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

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setDate(new Date(initialData.date));
      setSnoozeMinutes(initialData.snoozeMinutes || 10);
    }
  }, [initialData]);

  // Update parent ref for unsaved changes check
  useEffect(() => {
    if (hasUnsavedChangesRef) {
      const isDirty = checkIsDirty();
      hasUnsavedChangesRef.current = isDirty;
    }
  }, [title, description, date, snoozeMinutes]);

  const checkIsDirty = () => {
    if (!initialData) {
      return title.trim().length > 0 || description.trim().length > 0;
    }
    const isTitleChanged = title !== initialData.title;
    const isDescChanged = description !== (initialData.description || "");
    const isDateChanged =
      date.getTime() !== new Date(initialData.date).getTime();
    const isSnoozeChanged = snoozeMinutes !== (initialData.snoozeMinutes || 10);
    return isTitleChanged || isDescChanged || isDateChanged || isSnoozeChanged;
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
    });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
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
      >
        <AppInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Read Surah Yaseen"
        />

        <AppInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Add details..."
          multiline
        />

        <Text style={styles.sectionHeader}>When should we remind you?</Text>
        <View style={styles.dateTimeRow}>
          <TouchableOpacity
            style={styles.dateTimeCard}
            onPress={() => showMode("date")}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.cardLabel}>Date</Text>
              <Text style={styles.cardValue}>{date.toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeCard}
            onPress={() => showMode("time")}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="time" size={20} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.cardLabel}>Time</Text>
              <Text style={styles.cardValue}>
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

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

        <Text style={styles.sectionHeader}>Snooze Duration</Text>
        <View style={styles.snoozeRow}>
          {[5, 10, 15, 30].map((min) => (
            <TouchableOpacity
              key={min}
              style={[
                styles.snoozeChip,
                snoozeMinutes === min && styles.snoozeChipActive,
              ]}
              onPress={() => setSnoozeMinutes(min)}
            >
              <Text
                style={[
                  styles.snoozeText,
                  snoozeMinutes === min && styles.snoozeTextActive,
                ]}
              >
                {min}m
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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

  // Date Time Cards
  dateTimeRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateTimeCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    // Soft shadow
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "600",
    marginTop: 2,
  },

  // Snooze Chips
  snoozeRow: {
    flexDirection: "row",
    gap: 10,
  },
  snoozeChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50, // Capsule shape
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  snoozeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  snoozeText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  snoozeTextActive: {
    color: COLORS.white,
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
