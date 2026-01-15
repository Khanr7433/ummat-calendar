import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { TOPOGRAPHY } from "../../constants/typography";

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  style,
  ...props
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#bdc3c7"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...TOPOGRAPHY.label,
    marginBottom: 8,
  },
  input: {
    ...TOPOGRAPHY.input,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  textArea: {
    height: 100,
  },
});
