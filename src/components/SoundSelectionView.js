import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { REMINDER_CONFIG } from "../constants/reminderConfig";
import { COLORS } from "../constants/colors";
import { TOPOGRAPHY } from "../constants/typography";

export default function SoundSelectionView({ onBack }) {
  const [selectedSound, setSelectedSound] = useState(null);

  useEffect(() => {
    loadSoundPref();
  }, []);

  const loadSoundPref = async () => {
    try {
      const sound = await AsyncStorage.getItem(REMINDER_CONFIG.SOUND_PREF_KEY);
      setSelectedSound(sound || "default");
    } catch (e) {
      setSelectedSound("default");
    }
  };

  const handleSelect = async (soundId) => {
    try {
      await AsyncStorage.setItem(REMINDER_CONFIG.SOUND_PREF_KEY, soundId);
      setSelectedSound(soundId);
    } catch (e) {
      console.error("Failed to save sound pref", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Reminder Sound</Text>
      <Text style={styles.subtitle}>
        Select the sound for all future reminders
      </Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {REMINDER_CONFIG.SOUNDS.map((sound) => {
          const isSelected = selectedSound === sound.id;
          return (
            <TouchableOpacity
              key={sound.id}
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => handleSelect(sound.id)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View
                  style={[styles.iconBox, isSelected && styles.selectedIconBox]}
                >
                  <Ionicons
                    name={isSelected ? "musical-note" : "musical-note-outline"}
                    size={22}
                    color={isSelected ? COLORS.white : COLORS.textSecondary}
                  />
                </View>
                <Text
                  style={[styles.label, isSelected && styles.selectedLabel]}
                >
                  {sound.label}
                </Text>
              </View>

              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={COLORS.primary}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    ...TOPOGRAPHY.h2,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    ...TOPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  list: {
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,

    // Shadow
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIconBox: {
    backgroundColor: COLORS.primary,
  },
  label: {
    ...TOPOGRAPHY.body,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  selectedLabel: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  backButtonText: {
    ...TOPOGRAPHY.button,
    color: COLORS.white,
  },
});
