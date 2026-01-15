import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TOPOGRAPHY } from "../../constants/typography";

export default function ModalHeader({
  title,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
}) {
  return (
    <View style={styles.header}>
      {leftIcon && (
        <TouchableOpacity onPress={onLeftPress} style={styles.leftButton}>
          <Ionicons name={leftIcon} size={24} color="#2c3e50" />
        </TouchableOpacity>
      )}

      <Text style={styles.headerTitle}>{title}</Text>

      {rightIcon && (
        <TouchableOpacity onPress={onRightPress} style={styles.rightButton}>
          <Ionicons name={rightIcon} size={30} color="#2c3e50" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
    position: "relative",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 4,
  },
  headerTitle: {
    ...TOPOGRAPHY.headerTitle,
    textAlign: "center",
  },
  leftButton: {
    position: "absolute",
    left: 16,
    padding: 4,
  },
  rightButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
});
