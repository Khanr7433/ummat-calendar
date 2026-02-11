import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TOPOGRAPHY } from "../../constants/typography";
import { COLORS } from "../../constants/colors";

export default function EmptyState({ text, children }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>{text}</Text>
      {children && <Text style={styles.emptySubText}>{children}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    ...TOPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptySubText: {
    ...TOPOGRAPHY.body,
    color: COLORS.textTertiary,
    textAlign: "center",
  },
});
