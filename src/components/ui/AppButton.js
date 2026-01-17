import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { TOPOGRAPHY } from "../../constants/typography";
import { COLORS } from "../../constants/colors";

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  style,
}) {
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryBtn;
      case "destructive":
        return styles.destructiveBtn;
      case "primary":
      default:
        return styles.primaryBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryText;
      case "destructive":
        return styles.destructiveText;
      case "primary":
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.baseBtn, getButtonStyle(), style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.baseText, getTextStyle()]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseBtn: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  baseText: {
    ...TOPOGRAPHY.button,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, // Slightly more punchy
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryBtn: {
    backgroundColor: COLORS.inputBg, // Subtle gray background
  },
  secondaryText: {
    color: COLORS.textSecondary,
  },
  destructiveBtn: {
    backgroundColor: COLORS.dangerBg,
  },
  destructiveText: {
    color: COLORS.danger,
  },
});
