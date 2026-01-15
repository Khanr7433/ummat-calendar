import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TOPOGRAPHY } from "../../constants/typography";

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
    color: "#2c3e50",
    marginBottom: 8,
  },
  emptySubText: {
    ...TOPOGRAPHY.body,
    color: "#95a5a6",
    textAlign: "center",
  },
});
