import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TOPOGRAPHY } from "../constants/typography";

function Header({
  monthName,
  onSelectMonthPress,
  showBack,
  onFlipToggle,
  hasBackImage,
  topInset,
  onSettingsPress,
}) {
  return (
    <View style={[styles.header, { paddingTop: topInset + 8 }]}>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={onSelectMonthPress}
      >
        <Text style={styles.selectorText}>{monthName || "Select Month"} ▾</Text>
      </TouchableOpacity>

      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={onSettingsPress}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color="#2c3e50" />
        </TouchableOpacity>

        {hasBackImage && (
          <TouchableOpacity style={styles.flipButton} onPress={onFlipToggle}>
            <Text style={styles.flipButtonText}>
              {showBack ? "Show Front" : "Show Back"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectorText: {
    ...TOPOGRAPHY.button,
    color: "#2c3e50",
    letterSpacing: 0.3,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  flipButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
});

export default React.memo(Header);
