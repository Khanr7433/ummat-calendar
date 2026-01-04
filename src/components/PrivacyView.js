import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyView({ onBack }) {
  return (
    <View style={styles.subViewContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          The app requires minimal permissions to function correctly. We do not
          access your contacts, files, or location unless explicitly required
          for a feature and approved by you.
        </Text>

        <Text style={styles.sectionTitle}>Contact</Text>
        <Text style={styles.paragraph}>
          If you have any questions regarding this policy, please contact us
          ensuring to mention "Ummat Calendar Privacy" in the subject line.
        </Text>
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: "#34495e",
    lineHeight: 24,
    marginBottom: 12,
  },
});
