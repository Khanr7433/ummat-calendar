import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TOPOGRAPHY } from "../constants/typography";
import { COLORS } from "../constants/colors";

function Header({
  monthName,
  onSelectMonthPress,
  showBack,
  onFlipToggle,
  hasBackImage,
  topInset,
}) {
  return (
    <View style={[styles.header, { paddingTop: topInset + 12 }]}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={onSelectMonthPress}
        activeOpacity={0.6}
      >
        <Text style={styles.selectorText}>{monthName || "Select Month"}</Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.primary} />
      </TouchableOpacity>

      <View style={styles.rightContainer}>
        {hasBackImage && (
          <TouchableOpacity
            style={styles.flipButton}
            onPress={onFlipToggle}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showBack ? "image-outline" : "repeat-outline"}
              size={18}
              color={COLORS.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.flipButtonText}>
              {showBack ? "Front" : "Back"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectorText: {
    ...TOPOGRAPHY.h3,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#EEF2FF",
    borderRadius: 24,
    marginLeft: 8,
  },
  flipButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },
});

export default React.memo(Header);
