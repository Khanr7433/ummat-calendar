import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AboutView from "./AboutView";
import PrivacyView from "./PrivacyView";

export default function SettingsModal({ visible, onClose }) {
  const [currentView, setCurrentView] = useState("menu"); // 'menu' | 'about' | 'privacy'

  // Reset view when closing
  const handleClose = () => {
    setCurrentView("menu");
    onClose();
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
      onRequestClose={handleClose}
    >
      <Pressable style={styles.modalContainer} onPress={handleClose}>
        <Pressable
          style={styles.modalContent}
          onPress={(e) => {
            e.stopPropagation();
          }}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {currentView === "menu"
                ? "Settings"
                : currentView === "about"
                ? "About Us"
                : "Privacy Policy"}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#2c3e50" />
            </TouchableOpacity>
          </View>
          {renderContent()}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function MenuView({ onAboutPress, onPrivacyPress }) {
  return (
    <View style={styles.menuContainer}>
      <View style={styles.brandingContainer}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Ummat Calendar</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>

      <View style={styles.menuItems}>
        <TouchableOpacity style={styles.menuItem} onPress={onAboutPress}>
          <View style={styles.menuItemLeft}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#2c3e50"
            />
            <Text style={styles.menuItemText}>About Us</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={onPrivacyPress}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="lock-closed-outline" size={22} color="#2c3e50" />
            <Text style={styles.menuItemText}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Ummat Calendar
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    position: "relative",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    padding: 4,
  },

  // Menu Styles
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  brandingContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  menuItems: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingTop: 20,
  },
  footerText: {
    color: "#bdc3c7",
    fontSize: 12,
  },
});
