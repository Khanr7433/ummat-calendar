import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { REMINDER_CONFIG } from "../../constants/reminderConfig";
import { COLORS } from "../../constants/colors";
import { TOPOGRAPHY } from "../../constants/typography";

import { Audio } from "expo-av";
import { useEffect, useState } from "react";

// Map sound IDs to local assets
const SOUND_FILES = {
  default: require("../../../assets/sounds/alarm_clock.ogg"),
  digital: require("../../../assets/sounds/digital_watch_alarm_long.ogg"),
  mechanical: require("../../../assets/sounds/mechanical_clock_ring.ogg"),
  bell: require("../../../assets/sounds/medium_bell_ringing_near.ogg"),
  spaceship: require("../../../assets/sounds/spaceship_alarm.ogg"),
};

export default function SoundSelector({ selectedSoundId, onSelect }) {
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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

  const handleSelect = (soundId) => {
    onSelect(soundId);
    playSound(soundId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {REMINDER_CONFIG.SOUNDS.map((soundItem) => {
          const isSelected = selectedSoundId === soundItem.id;
          return (
            <TouchableOpacity
              key={soundItem.id}
              style={[styles.option, isSelected && styles.selectedOption]}
              onPress={() => handleSelect(soundItem.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSelected ? "musical-note" : "musical-note-outline"}
                size={16}
                color={isSelected ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.label, isSelected && styles.selectedLabel]}>
                {soundItem.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  list: {
    gap: 8,
    paddingHorizontal: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  label: {
    ...TOPOGRAPHY.caption,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  selectedLabel: {
    color: COLORS.white,
  },
});
