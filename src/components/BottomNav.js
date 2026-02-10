import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { TOPOGRAPHY } from "../constants/typography";

import { useApp } from "../context/AppContext";

export default function BottomNav() {
  const { openReminders, openSettings } = useApp();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={openReminders}
        activeOpacity={0.7}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={COLORS.textPrimary}
        />
        <Text style={styles.navLabel}>Reminders</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.navItem}
        onPress={openSettings}
        activeOpacity={0.7}
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color={COLORS.textPrimary}
        />
        <Text style={styles.navLabel}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 0 : 10,

    borderTopWidth: 1,
    borderTopColor: COLORS.border,

    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  navLabel: {
    ...TOPOGRAPHY.caption,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
});
