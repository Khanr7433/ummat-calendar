import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import AboutView from "./AboutView";
import PrivacyView from "./PrivacyView";
import MenuView from "./MenuView";

export default function SettingsModal({ visible, onClose }) {
  const [currentView, setCurrentView] = useState("menu");

  const resetState = () => {
    setCurrentView("menu");
  };

  const handleRequestClose = () => {
    if (currentView !== "menu") {
      setCurrentView("menu");
    } else {
      onClose();
      setTimeout(resetState, 200);
    }
  };

  const handleCloseButton = () => {
    onClose();
    setTimeout(resetState, 200);
  };

  const renderContent = () => {
    switch (currentView) {
      case "about":
        return <AboutView onBack={() => setCurrentView("menu")} />;
      case "privacy":
        return <PrivacyView onBack={() => setCurrentView("menu")} />;
      default:
        return (
          <MenuView
            onAboutPress={() => setCurrentView("about")}
            onPrivacyPress={() => setCurrentView("privacy")}
          />
        );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleRequestClose}
    >
      <StatusBar style="dark" backgroundColor="#fff" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {currentView !== "menu" && (
            <TouchableOpacity
              onPress={() => setCurrentView("menu")}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#2c3e50" />
            </TouchableOpacity>
          )}

          <Text style={styles.headerTitle}>
            {currentView === "menu"
              ? "Settings"
              : currentView === "about"
              ? "About Us"
              : "Privacy Policy"}
          </Text>

          <TouchableOpacity
            onPress={handleCloseButton}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
    position: "relative",
    backgroundColor: "#fff",
    // Optional shadow for header separation
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#2c3e50",
    letterSpacing: 0.3,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 4,
  },
});
