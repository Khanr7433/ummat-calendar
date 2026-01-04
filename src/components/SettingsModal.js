import React, { useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Linking,
  Animated,
  PanResponder,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AboutView from "./AboutView";
import PrivacyView from "./PrivacyView";

export default function SettingsModal({ visible, onClose }) {
  const [currentView, setCurrentView] = useState("menu"); // 'menu' | 'about' | 'privacy'
  const pan = useRef(new Animated.ValueXY()).current;

  // Reset view when closing
  const resetState = () => {
    setCurrentView("menu");
    pan.setValue({ x: 0, y: 0 });
  };

  const handleRequestClose = () => {
    if (currentView !== "menu") {
      setCurrentView("menu");
    } else {
      onClose();
      setTimeout(resetState, 500);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Activate only when swiping down significantly
        return (
          gestureState.dy > 5 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx)
        );
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();

        if (gestureState.dy > 150) {
          onClose();
          setTimeout(resetState, 500);
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const translateY = pan.y.interpolate({
    inputRange: [-1000, 0, 1000],
    outputRange: [0, 0, 1000],
    extrapolate: "clamp",
  });

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
      <Pressable style={styles.modalContainer} onPress={handleRequestClose}>
        <Animated.View
          style={[
            styles.modalContentWrapper,
            { transform: [{ translateY: translateY }] },
          ]}
          {...panResponder.panHandlers}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {currentView === "menu"
                  ? "Settings"
                  : currentView === "about"
                  ? "About Us"
                  : "Privacy Policy"}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#2c3e50" />
              </TouchableOpacity>
            </View>
            {renderContent()}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

function MenuView({ onAboutPress, onPrivacyPress }) {
  const handleYouTubePress = () => {
    Linking.openURL("https://www.youtube.com/@MadrasaBaitulUloomPune");
  };

  const handleInstagramPress = () => {
    Linking.openURL("https://www.instagram.com/baitul_uloom_kondhwa_pune/");
  };

  const handleTelegramPress = () => {
    Linking.openURL("https://t.me/mbupofficial");
  };

  const handleFacebookPress = () => {
    Linking.openURL("https://facebook.com/baitul.uloom.1");
  };

  const handleTwitterPress = () => {
    Linking.openURL("https://twitter.com/BaitulUloom2003");
  };

  const handleWhatsAppPress = () => {
    Linking.openURL("https://chat.whatsapp.com/KMXlF6CoOme4yBa15mHgMC");
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:baitululoompune@gmail.com");
  };

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

        <TouchableOpacity style={styles.menuItem} onPress={handleEmailPress}>
          <View style={styles.menuItemLeft}>
            <Ionicons name="mail-outline" size={22} color="#EA4335" />
            <Text style={styles.menuItemText}>Contact via Email</Text>
          </View>
          <Ionicons name="open-outline" size={20} color="#bdc3c7" />
        </TouchableOpacity>

        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={handleYouTubePress}
            >
              <Ionicons name="logo-youtube" size={28} color="#e74c3c" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={handleInstagramPress}
            >
              <Ionicons name="logo-instagram" size={28} color="#E1306C" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={handleTelegramPress}
            >
              <Ionicons name="paper-plane" size={28} color="#0088cc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={handleFacebookPress}
            >
              <Ionicons name="logo-facebook" size={28} color="#1877F2" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={handleTwitterPress}
            >
              <Ionicons name="logo-twitter" size={28} color="#1DA1F2" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIconButton}
              onPress={handleWhatsAppPress}
            >
              <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
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
  modalContentWrapper: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "90%",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    overflow: "hidden",
  },
  modalContent: {
    flex: 1,
    paddingBottom: 20,
  },
  dragHandleContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#dbdbdb",
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

  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  brandingContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  appName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 2,
  },
  appVersion: {
    fontSize: 12,
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
    padding: 12,
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
    fontSize: 15,
    color: "#2c3e50",
    fontWeight: "500",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
  },
  footerText: {
    color: "#bdc3c7",
    fontSize: 11,
  },
  socialSection: {
    marginTop: 15,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  socialTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  socialIconButton: {
    padding: 6,
  },
});
