import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { SNOOZE_OPTIONS } from "../../constants/reminderConfig";

export default function SnoozeSection({ snoozeMinutes, onSelect }) {
  return (
    <View style={styles.snoozeRow}>
      {SNOOZE_OPTIONS.map((min) => (
        <TouchableOpacity
          key={min}
          style={[
            styles.snoozeChip,
            snoozeMinutes === min && styles.snoozeChipActive,
          ]}
          onPress={() => onSelect(min)}
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
  );
}

const styles = StyleSheet.create({
  snoozeRow: {
    flexDirection: "row",
    gap: 10,
  },
  snoozeChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 50,
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
});
