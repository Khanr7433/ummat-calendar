import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AboutView({ onBack }) {
  return (
    <View style={styles.subViewContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Madarsa Baitul Uloom</Text>
        <Text style={styles.paragraph}>
          Madarsa Baitul Uloom, located in Pune, is dedicated to providing
          authentic Islamic education and services to the community.
        </Text>

        <Text style={styles.sectionTitle}>Founder</Text>
        <Text style={styles.paragraph}>
          This calendar was established under the guidance of Mufti Shakir Khan
          Sahab, may Allah preserve him.
        </Text>

        <Text style={styles.sectionTitle}>Mission</Text>
        <Text style={styles.paragraph}>
          To connect the Ummah with the correct Islamic dates and events,
          promoting unity and awareness.
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
