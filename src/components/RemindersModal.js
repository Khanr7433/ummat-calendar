import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  BackHandler,
  StyleSheet,
} from "react-native";
import { ReminderService } from "../services/ReminderService";

import ModalContainer from "./ui/ModalContainer";
import ModalHeader from "./ui/ModalHeader";
import EmptyState from "./ui/EmptyState";
import ReminderItem from "./reminders/ReminderItem";
import ReminderForm from "./reminders/ReminderForm";

export default function RemindersModal({ visible, onClose }) {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  // Ref to track dirty state in child form
  const hasUnsavedChangesRef = useRef(false);

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
      backAction,
    );

    return () => backHandler.remove();
  }, [visible, showAddForm]);

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
    setEditingReminder(reminder);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    if (hasUnsavedChangesRef.current) {
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
        ],
      );
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setEditingReminder(null);
    setShowAddForm(false);
    hasUnsavedChangesRef.current = false;
  };

  const handleSaveReminder = async (formData) => {
    try {
      if (editingReminder) {
        await ReminderService.updateReminder({
          ...formData,
          id: editingReminder.id,
        });
        Alert.alert("Success", "Reminder updated!");
      } else {
        await ReminderService.addReminder(formData);
        Alert.alert("Success", "Reminder scheduled!");
      }

      resetForm();
      loadReminders();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to save reminder");
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
      ],
    );
  };

  const renderItem = ({ item }) => (
    <ReminderItem
      item={item}
      onEdit={handleEditPress}
      onDelete={handleDeleteReminder}
    />
  );

  const headerActionLeft = showAddForm ? handleCloseForm : onClose;
  const headerIconRight = !showAddForm ? "add" : null;

  return (
    <ModalContainer
      visible={visible}
      onRequestClose={showAddForm ? handleCloseForm : onClose}
    >
      <ModalHeader
        title={
          showAddForm
            ? editingReminder
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
          <ReminderForm
            initialData={editingReminder}
            onSave={handleSaveReminder}
            onCancel={handleCloseForm}
            hasUnsavedChangesRef={hasUnsavedChangesRef}
          />
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
});
