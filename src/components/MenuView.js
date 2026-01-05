import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TOPOGRAPHY } from "../constants/typography";

export default function MenuView({ onAboutPress, onPrivacyPress }) {
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
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  brandingContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 12,
  },
  appName: {
    ...TOPOGRAPHY.h2,
    fontSize: 22,
    color: "#2c3e50",
    marginBottom: 4,
  },
  appVersion: {
    ...TOPOGRAPHY.caption,
    fontSize: 13,
    color: "#95a5a6",
    letterSpacing: 0.5,
  },
  menuItems: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    marginBottom: 20,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuItemText: {
    fontSize: 16,
    color: "#34495e",
    fontWeight: "500",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingBottom: 10,
  },
  footerText: {
    color: "#bdc3c7",
    fontSize: 12,
  },
  socialSection: {
    marginTop: 8,
    backgroundColor: "#fafafa",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  socialTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7f8c8d",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  socialIconButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
