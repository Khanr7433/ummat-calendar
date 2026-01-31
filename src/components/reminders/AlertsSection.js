import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AppInput from "../ui/AppInput";
import { COLORS } from "../../constants/colors";
import { ALERT_OPTIONS, ALERT_TYPES } from "../../constants/reminderConfig";

export default function AlertsSection({
  selectedAlerts,
  onToggleAlert,
  customDays,
  onCustomDaysChange,
}) {
  return (
    <View>
      <View style={styles.alertOptionsContainer}>
        {ALERT_OPTIONS.map((option) => {
          const isSelected = selectedAlerts.some(
            (a) =>
              a === option.id ||
              (option.id === ALERT_TYPES.CUSTOM &&
                a.startsWith(ALERT_TYPES.CUSTOM_PREFIX)),
          );
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.alertChip, isSelected && styles.alertChipActive]}
              onPress={() => onToggleAlert(option.id)}
            >
              <Text
                style={[
                  styles.alertChipText,
                  isSelected && styles.alertChipTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedAlerts.some((a) => a.startsWith(ALERT_TYPES.CUSTOM_PREFIX)) && (
        <View style={styles.customDaysRow}>
          <Text style={styles.customLabel}>Notify</Text>
          <AppInput
            value={customDays}
            onChangeText={(text) => {
              const numeric = text.replace(/[^0-9]/g, "");
              onCustomDaysChange(numeric);
            }}
            keyboardType="number-pad"
            maxLength={3}
            style={{ width: 60, marginBottom: 0 }}
            containerStyle={{ marginBottom: 0 }}
          />
          <Text style={styles.customLabel}>days before</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  alertOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  alertChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  alertChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  alertChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  alertChipTextActive: {
    color: COLORS.white,
  },
  customDaysRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 12,
  },
  customLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});
