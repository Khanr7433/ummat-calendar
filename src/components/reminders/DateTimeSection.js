import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function DateTimeSection({ date, onDatePress, onTimePress }) {
  return (
    <View style={styles.dateTimeRow}>
      <TouchableOpacity style={styles.dateTimeCard} onPress={onDatePress}>
        <View style={styles.iconCircle}>
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
        </View>
        <View>
          <Text style={styles.cardLabel}>Date</Text>
          <Text style={styles.cardValue}>
            {date.toLocaleDateString("en-GB")}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dateTimeCard} onPress={onTimePress}>
        <View style={[styles.iconCircle, { backgroundColor: "#ECFDF5" }]}>
          <Ionicons name="time" size={20} color={COLORS.success} />
        </View>
        <View>
          <Text style={styles.cardLabel}>Time</Text>
          <Text style={styles.cardValue}>
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
