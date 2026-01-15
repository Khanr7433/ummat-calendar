import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ReminderService } from "../services/ReminderService";
import { TOPOGRAPHY } from "../constants/typography";

export default function RemindersModal({ visible, onClose }) {
  const [reminders, setReminders] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      loadReminders();
    }
  }, [visible]);

  const loadReminders = async () => {
    const data = await ReminderService.getReminders();
    // Sort by date upcoming
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setReminders(data);
  };

  const handleAddReminder = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    try {
      const newReminder = {
        title,
        description,
        date: date.toISOString(),
      };

      await ReminderService.addReminder(newReminder);

      // Reset form
      setTitle("");
      setDescription("");
      setDate(new Date());
      setShowAddForm(false);

      // Reload list
      loadReminders();
      Alert.alert("Success", "Reminder scheduled!");
    } catch (error) {
      Alert.alert("Error", "Failed to schedule reminder");
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

  const renderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <View style={styles.reminderIconContainer}>
        <Ionicons name="notifications" size={24} color="#3498db" />
      </View>
      <View style={styles.reminderInfo}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
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
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteReminder(item.id)}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true} // Keep true but occupy full screen with white bg
      onRequestClose={onClose}
    >
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        {/* Header matching SettingsModal */}
        <View style={styles.header}>
          {showAddForm && (
            <TouchableOpacity
              onPress={() => setShowAddForm(false)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#2c3e50" />
            </TouchableOpacity>
          )}

          <Text style={styles.headerTitle}>
            {showAddForm ? "Add Reminder" : "Reminders"}
          </Text>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {!showAddForm ? (
            <>
              {reminders.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No reminders set.</Text>
                </View>
              ) : (
                <FlatList
                  data={reminders}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              )}
              <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowAddForm(true)}
              >
                <Ionicons name="add" size={30} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Buy groceries"
                placeholderTextColor="#bdc3c7"
              />

              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Milk, Eggs, Bread..."
                placeholderTextColor="#bdc3c7"
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
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleAddReminder}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16, // Add padding to content similar to Settings views usually
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
    position: "relative",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 4,
  },
  headerTitle: {
    ...TOPOGRAPHY.h3,
    fontSize: 17,
    color: "#2c3e50",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 4,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100, // Space for FAB
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#95a5a6",
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
    fontSize: 17,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 4,
  },
  reminderDesc: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 8,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderTime: {
    fontSize: 13,
    color: "#95a5a6",
    marginLeft: 6,
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#fff0f0",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  formContainer: {
    flex: 1,
    paddingTop: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#57606f",
    marginBottom: 8,
    marginTop: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e4e8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
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
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    gap: 16,
    paddingBottom: 20,
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#f1f2f6",
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#747d8c",
  },
  saveBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#3498db",
    alignItems: "center",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
