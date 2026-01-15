import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ReminderService } from "../services/ReminderService";
import { TOPOGRAPHY } from "../constants/typography";

import ModalContainer from "./ui/ModalContainer";
import ModalHeader from "./ui/ModalHeader";
import AppButton from "./ui/AppButton";
import AppInput from "./ui/AppInput";
import EmptyState from "./ui/EmptyState";

export default function RemindersModal({ visible, onClose }) {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());

  const [editingId, setEditingId] = useState(null);
  const [originalReminder, setOriginalReminder] = useState(null);
  const [mode, setMode] = useState("date");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      loadReminders();
    }
  }, [visible]);

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        if (showAddForm) {
          handleCloseForm();
          return true;
        }
        onClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [visible, showAddForm, editingId, title, description, date]);

  const loadReminders = async () => {
    const data = await ReminderService.getReminders();
    const now = new Date();

    data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const isExpiredA = dateA < now;
      const isExpiredB = dateB < now;

      if (isExpiredA === isExpiredB) {
        return dateA - dateB;
      }
      return isExpiredA ? 1 : -1;
    });

    setReminders(data);
  };

  const handleEditPress = (reminder) => {
    setTitle(reminder.title);
    setDescription(reminder.description || "");
    setDate(new Date(reminder.date));
    setEditingId(reminder.id);
    setOriginalReminder(reminder);
    setShowAddForm(true);
  };

  const hasUnsavedChanges = () => {
    if (!showAddForm) return false;

    if (!editingId) {
      return title.trim().length > 0 || description.trim().length > 0;
    }

    const isTitleChanged = title !== originalReminder.title;
    const isDescChanged = description !== (originalReminder.description || "");
    const isDateChanged =
      date.getTime() !== new Date(originalReminder.date).getTime();

    return isTitleChanged || isDescChanged || isDateChanged;
  };

  const onHardwareBackPress = () => {
    if (showAddForm) {
      handleCloseForm();
    } else {
      onClose();
    }
  };

  const handleCloseForm = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to discard them?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: resetForm,
          },
        ]
      );
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate(new Date());
    setEditingId(null);
    setOriginalReminder(null);
    setShowAddForm(false);
  };

  const handleAddReminder = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    try {
      const reminderData = {
        title,
        description,
        date: date.toISOString(),
      };

      if (editingId) {
        await ReminderService.updateReminder({
          ...reminderData,
          id: editingId,
        });
        Alert.alert("Success", "Reminder updated!");
      } else {
        await ReminderService.addReminder(reminderData);
        Alert.alert("Success", "Reminder scheduled!");
      }

      resetForm();
      loadReminders();
    } catch (error) {
      Alert.alert("Error", "Failed to save reminder");
    }
  };

  const handleDeleteReminder = async (id) => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await ReminderService.deleteReminder(id);
            loadReminders();
          },
        },
      ]
    );
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

  const renderItem = ({ item }) => {
    const isExpired = new Date(item.date) < new Date();

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleEditPress(item)}
        style={[styles.reminderItem, isExpired && styles.expiredItem]}
      >
        <View
          style={[
            styles.reminderIconContainer,
            isExpired && styles.expiredIconContainer,
          ]}
        >
          <Ionicons
            name={isExpired ? "alert-circle" : "notifications"}
            size={24}
            color={isExpired ? "#95a5a6" : "#3498db"}
          />
        </View>
        <View style={styles.reminderInfo}>
          <Text style={[styles.reminderTitle, isExpired && styles.expiredText]}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={styles.reminderDesc} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color="#95a5a6" />
            <Text style={styles.reminderTime}>
              {new Date(item.date).toLocaleString([], {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            {isExpired && <Text style={styles.expiredLabel}> • Expired</Text>}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteReminder(item.id)}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const headerActionLeft = showAddForm ? handleCloseForm : onClose;
  const headerIconRight = !showAddForm ? "add" : null;

  return (
    <ModalContainer visible={visible} onRequestClose={onHardwareBackPress}>
      <ModalHeader
        title={
          showAddForm
            ? editingId
              ? "Edit Reminder"
              : "Add Reminder"
            : "Reminders"
        }
        leftIcon="arrow-back"
        onLeftPress={headerActionLeft}
        rightIcon={headerIconRight}
        onRightPress={() => setShowAddForm(true)}
      />

      <View style={styles.contentContainer}>
        {!showAddForm ? (
          <>
            {reminders.length === 0 ? (
              <EmptyState text="No reminders set.">
                Tap the <Text style={styles.plusSymbol}>+</Text> button to add a
                reminder.
              </EmptyState>
            ) : (
              <FlatList
                data={reminders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        ) : (
          <View style={styles.formContainer}>
            <AppInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="Read Quran"
            />

            <AppInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Surah Yaseen"
              multiline
            />

            <Text style={styles.label}>Date & Time</Text>
            <View style={styles.dateTimeBtns}>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => showMode("date")}
              >
                <Text style={styles.dateBtnText}>
                  {date.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => showMode("time")}
              >
                <Text style={styles.dateBtnText}>
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
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

            <View style={styles.formActions}>
              <AppButton
                title="Cancel"
                onPress={handleCloseForm}
                variant="secondary"
              />
              <View style={{ width: 16 }} />
              <AppButton
                title={editingId ? "Update" : "Save"}
                onPress={handleAddReminder}
                variant="primary"
              />
            </View>
          </View>
        )}
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
  plusSymbol: {
    fontWeight: "700",
    color: "#2c3e50",
  },
  reminderItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f2f5",
  },
  expiredItem: {
    opacity: 0.6,
    backgroundColor: "#f8f9fa",
    borderColor: "#e1e4e8",
  },
  expiredIconContainer: {
    backgroundColor: "#e1e4e8",
  },
  expiredText: {
    color: "#7f8c8d",
    textDecorationLine: "line-through",
  },
  expiredLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#e74c3c",
    marginLeft: 4,
  },
  reminderIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ecf5fb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    ...TOPOGRAPHY.cardTitle,
    marginBottom: 4,
  },
  reminderDesc: {
    ...TOPOGRAPHY.cardSubtitle,
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderTime: {
    ...TOPOGRAPHY.caption,
    marginLeft: 6,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff0f0",
  },
  formContainer: {
    flex: 1,
    paddingTop: 10,
  },
  label: {
    ...TOPOGRAPHY.label,
    marginBottom: 8,
    marginTop: 16,
  },
  dateTimeBtns: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  dateBtn: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e4e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dateBtnText: {
    ...TOPOGRAPHY.input,
    fontWeight: "500",
  },
  formActions: {
    flexDirection: "row",
    marginTop: "auto",
    paddingBottom: 20,
  },
});
