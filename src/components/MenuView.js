import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  Switch,
  Platform,
  LayoutAnimation,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useApp } from "../context/AppContext";
import { TOPOGRAPHY } from "../constants/typography";
import { COLORS } from "../constants/colors";

export default function MenuView({ onAboutPress, onPrivacyPress }) {
  const { dailyNotificationSettings, updateDailyNotificationSettings } =
    useApp();
  const [showTimePicker, setShowTimePicker] = React.useState(false);

  // Animate changes
  const animate = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  const socialLinks = [
    {
      icon: "logo-youtube",
      color: "#FF0000",
      url: "https://www.youtube.com/@MadrasaBaitulUloomPune",
    },
    {
      icon: "logo-instagram",
      color: "#E1306C",
      url: "https://www.instagram.com/baitul_uloom_kondhwa_pune/",
    },
    {
      icon: "paper-plane",
      color: "#0088CC",
      url: "https://t.me/mbupofficial",
    },
    {
      icon: "logo-facebook",
      color: "#1877F2",
      url: "https://facebook.com/baitul.uloom.1",
    },
    {
      icon: "logo-twitter",
      color: "#1DA1F2",
      url: "https://twitter.com/BaitulUloom2003",
    },
    {
      icon: "logo-whatsapp",
      color: "#25D366",
      url: "https://chat.whatsapp.com/KMXlF6CoOme4yBa15mHgMC",
    },
  ];

  const handleLink = (url) => Linking.openURL(url);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>Ummat Calendar</Text>
        <Text style={styles.version}>
          Version{" "}
          {Constants.expoConfig?.version ??
            Constants.manifest?.version ??
            "1.0.0"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>GENERAL</Text>
      <View style={styles.menuGroup}>
        <MenuItem
          icon="information-circle-outline"
          label="About Us"
          onPress={onAboutPress}
        />
        <View style={styles.separator} />
        <MenuItem
          icon="shield-checkmark-outline"
          label="Privacy Policy"
          onPress={onPrivacyPress}
        />
        <View style={styles.separator} />
        <MenuItem
          icon="mail-outline"
          label="Contact Us"
          onPress={() => handleLink("mailto:baitululoompune@gmail.com")}
          iconColor={COLORS.primary}
        />
      </View>

      <Text style={styles.sectionTitle}>SUPPORT US</Text>
      <View style={styles.socialGrid}>
        {socialLinks.map((social, index) => (
          <TouchableOpacity
            key={index}
            style={styles.socialCard}
            onPress={() => handleLink(social.url)}
            activeOpacity={0.7}
          >
            <Ionicons name={social.icon} size={28} color={social.color} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Ummat Calendar
        </Text>
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ icon, label, onPress, iconColor }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemContent}>
      <View style={[styles.iconBox, { backgroundColor: COLORS.background }]}>
        <Ionicons
          name={icon}
          size={20}
          color={iconColor || COLORS.textPrimary}
        />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Light Grey bg
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginVertical: 32,
  },
  logoContainer: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 10,
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    ...TOPOGRAPHY.h2,
    marginBottom: 4,
  },
  version: {
    ...TOPOGRAPHY.caption,
    fontSize: 14,
  },

  sectionTitle: {
    ...TOPOGRAPHY.sectionHeader,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuGroup: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,

    // IOS Shadow
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    ...TOPOGRAPHY.body,
    fontWeight: "500",
  },
  menuSubLabel: {
    ...TOPOGRAPHY.caption,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  valueContainer: {
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  valueText: {
    ...TOPOGRAPHY.label,
    fontWeight: "600",
    color: COLORS.primary,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 64, // Indented separator
  },

  socialGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginBottom: 32,
  },
  socialCard: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  footer: {
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    ...TOPOGRAPHY.caption,
  },
});
