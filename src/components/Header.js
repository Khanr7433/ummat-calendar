import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TOPOGRAPHY } from "../constants/typography";
import { COLORS } from "../constants/colors";

import { useApp } from "../context/AppContext";

function Header({ monthName, hasBackImage, topInset, onPressDate }) {
  const { openMonthSelector, showBack, toggleFlip, headerDate } = useApp();
  return (
    <View style={[styles.header, { paddingTop: topInset + 12 }]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={openMonthSelector}
          activeOpacity={0.6}
        >
          <Text style={styles.selectorText}>{monthName || "Select Month"}</Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContainer}>
        {headerDate?.hijri ? (
          <TouchableOpacity
            style={styles.dateContainer}
            onPress={onPressDate}
            activeOpacity={0.7}
          >
            <Text style={styles.hijriDate}>{headerDate.hijri}</Text>
            <Text style={styles.gregorianDate}>{headerDate.gregorian}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.rightContainer}>
        {hasBackImage && (
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleFlip}
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
    backgroundColor: COLORS.background, // Off-white consistency
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dateContainer: {
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  hijriDate: {
    ...TOPOGRAPHY.label,
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 2,
  },
  gregorianDate: {
    ...TOPOGRAPHY.label,
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  selectorText: {
    ...TOPOGRAPHY.h3,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    fontSize: 16, // Reduce slightly if needed to fit
  },

  flipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 24,
    // marginLeft: 8, // No longer needed with flex/align
  },
  flipButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
});

export default React.memo(Header);
