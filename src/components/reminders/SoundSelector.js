import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { REMINDER_CONFIG } from "../../constants/reminderConfig";
import { COLORS } from "../../constants/colors";
import { TOPOGRAPHY } from "../../constants/typography";

import { Audio } from "expo-av";
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

// Map sound IDs to local assets
const SOUND_FILES = {
  default: require("../../../assets/sounds/custom_alarm_1.ogg"),
  digital: require("../../../assets/sounds/digital_watch_alarm_long.ogg"),
  mechanical: require("../../../assets/sounds/custom_morning_clock.ogg"),
  bell: require("../../../assets/sounds/custom_classic_alarm.ogg"),
  spaceship: require("../../../assets/sounds/custom_vintage_warning.ogg"),
  melody: require("../../../assets/sounds/custom_hall_alert.ogg"),
  soft_chime: require("../../../assets/sounds/custom_alert_alarm.ogg"),
};

const SoundSelector = forwardRef(({ selectedSoundId, onSelect }, ref) => {
  const [sound, setSound] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempSelectedId, setTempSelectedId] = useState(selectedSoundId);

  useEffect(() => {
    setTempSelectedId(selectedSoundId);
  }, [selectedSoundId]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useImperativeHandle(ref, () => ({
    stopPreview: async () => {
      if (sound) {
        try {
          await sound.stopAsync();
        } catch (err) {
          console.log("Error stopping sound", err);
        }
      }
    },
  }));

  const playSound = async (soundId) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const source = SOUND_FILES[soundId] || SOUND_FILES.default;
      const { sound: newSound } = await Audio.Sound.createAsync(source);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.log("Error playing sound", error);
    }
  };

  const handlePreview = (soundId) => {
    setTempSelectedId(soundId);
    playSound(soundId);
  };

  const handleApply = () => {
    onSelect(tempSelectedId);
    setIsExpanded(false);
  };

  const selectedSound =
    REMINDER_CONFIG.SOUNDS.find((s) => s.id === selectedSoundId) ||
    REMINDER_CONFIG.SOUNDS[0];

  return (
    <View style={styles.container}>
      {/* Dropdown Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="musical-note" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.headerLabel}>{selectedSound.label}</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {/* Expanded List */}
      {isExpanded && (
        <View style={styles.dropdownContainer}>
          <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
            {REMINDER_CONFIG.SOUNDS.map((soundItem) => {
              const isSelected = tempSelectedId === soundItem.id;
              return (
                <TouchableOpacity
                  key={soundItem.id}
                  style={[styles.option, isSelected && styles.selectedOption]}
                  onPress={() => handlePreview(soundItem.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.optionIcon,
                      isSelected && styles.selectedOptionIcon,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={COLORS.white}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.selectedOptionLabel,
                    ]}
                  >
                    {soundItem.label}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="volume-medium"
                      size={16}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

export default SoundSelector;

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLabel: {
    ...TOPOGRAPHY.body,
    fontWeight: "600",
    color: COLORS.text,
  },
  dropdownContainer: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
  },
  dropdownList: {
    maxHeight: 250,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    gap: 12,
  },
  selectedOption: {
    backgroundColor: "#F8F9FE",
  },
  optionIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOptionIcon: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionLabel: {
    ...TOPOGRAPHY.body,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  selectedOptionLabel: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    ...TOPOGRAPHY.button,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
