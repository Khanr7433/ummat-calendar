import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TOPOGRAPHY } from "../constants/typography";
import { COLORS } from "../constants/colors";

export default function PrivacyView({ onBack }) {
  return (
    <View style={styles.subViewContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
      >
        <Text style={styles.paragraph}>
          Your privacy is important to us. This privacy policy explains how our
          app "Ummat Calendar" handles your data.
        </Text>

        <Text style={styles.sectionTitle}>Data Collection & Usage</Text>
        <Text style={styles.paragraph}>
          The "Ummat Calendar" application is designed with your privacy as a
          priority. We do not collect, transmit, or store any personal data on
          external servers.
        </Text>
        <Text style={styles.paragraph}>
          All data, including your reminders, preferences, and settings, is
          stored locally on your device using your device's internal storage.
          This data remains completely under your control and is deleted if you
          uninstall the application.
        </Text>

        <Text style={styles.sectionTitle}>Location Information</Text>
        <Text style={styles.paragraph}>
          We do NOT access your device's precise GPS location. To ensure the
          Hijri date matches the printed Ummat Calendar (which follows Indian
          moon sighting), the app uses a standard default location (India) for
          all date calculations.
        </Text>
        <Text style={styles.paragraph}>
          This default location is sent to the **Aladhan API** to fetch the
          calendar data. No personal location data is collected or transmitted.
        </Text>

        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          **Aladhan API**: We use this service to fetch accurate Islamic
          calendar data. Their use of data is governed by their own privacy
          policy.
        </Text>

        <Text style={styles.sectionTitle}>App Permissions</Text>
        <Text style={styles.paragraph}>
          To provide full functionality, the app may request the following
          permissions:
        </Text>
        <Text style={styles.subTitle}>Notifications</Text>
        <Text style={styles.paragraph}>
          We request permission to send local notifications. This is strictly
          used to deliver the reminders you have scheduled within the app (e.g.,
          calendar events, custom reminders) and daily date updates. These
          notifications are generated locally on your device.
        </Text>

        <Text style={styles.subTitle}>Alarms & Reminders</Text>
        <Text style={styles.paragraph}>
          On Android 12 and above, we may request permission to schedule exact
          alarms to ensure your reminders are delivered precisely at the time
          you set.
        </Text>

        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.paragraph}>
          If you have any questions regarding this policy, please contact us
          ensuring to mention "Ummat Calendar Privacy" in the subject line.
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:baitululoompune@gmail.com")}
        >
          <Text style={[styles.paragraph, { color: COLORS.primary }]}>
            baitululoompune@gmail.com
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  subViewContainer: {
    flex: 1,
    backgroundColor: COLORS.background, // Ensure background is set
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    ...TOPOGRAPHY.h3,
    marginTop: 20,
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  paragraph: {
    ...TOPOGRAPHY.body,
    marginBottom: 12,
    color: COLORS.textSecondary,
  },
  subTitle: {
    ...TOPOGRAPHY.h3, // Reuse h3 or use label
    fontSize: 16,
    marginBottom: 4,
    marginTop: 8,
    color: COLORS.textPrimary,
  },
});
