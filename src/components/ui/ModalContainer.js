import React from "react";
import { Modal, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants/colors";

export default function ModalContainer({ visible, onRequestClose, children }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onRequestClose}
    >
      <StatusBar style="dark" backgroundColor={COLORS.background} />
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
