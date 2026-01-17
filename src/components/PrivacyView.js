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

        <Text style={styles.sectionTitle}>Data Collection</Text>
        <Text style={styles.paragraph}>
          This application does not collect, store, or transmit any personal
          user data. All calendar calculations are performed locally on your
          device.
        </Text>

        <Text style={styles.sectionTitle}>Permissions</Text>
        <Text style={styles.paragraph}>
          The app requires minimal permissions to function correctly.
        </Text>
        <Text style={styles.paragraph}>
          **Notifications**: We request permission to send notifications solely
          to provide the reminders you schedule. These are managed locally on
          your device.
        </Text>
        <Text style={styles.paragraph}>
          We do not access your contacts, files, or location unless explicitly
          required for a feature and approved by you.
        </Text>

        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.paragraph}>
          If you have any questions regarding this policy, please contact us
          ensuring to mention "Ummat Calendar Privacy" in the subject line.
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:baitululoompune@gmail.com")}
        >
          <Text style={[styles.paragraph, { color: "#3498db" }]}>
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
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    ...TOPOGRAPHY.h3,
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    ...TOPOGRAPHY.body,
    marginBottom: 12,
  },
});
