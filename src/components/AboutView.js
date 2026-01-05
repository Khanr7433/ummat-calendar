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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>BAITUL ULOOM KONDHWA PUNE</Text>

        <Text style={styles.subTitle}>Description</Text>
        <Text style={styles.paragraph}>
          Dear Users,{"\n"}
          Assalamualikum Warahmatullahi wa barakatuh{"\n"}
          In view of the importance of religious education and the need of
          Ummat-e-Muslima this madrasa has been started in 2003 and thereafter
          Modern Education was also added in it.
        </Text>

        <Text style={styles.subTitle}>Objects/Visions</Text>
        <Text style={styles.paragraph}>
          The primary objective of this Madrasa is to make such scholars who are
          full of religious knowledge who are aware of various skills, who are
          economically self-sufficient so that they can serve for the religion
          being volunteer.
        </Text>

        <Text style={styles.subTitle}>Educational Faculties</Text>
        <Text style={styles.paragraph}>
          A complete religious education means Diniyat, Hifz, Tajweed and
          Aalimiyat (scholars) and along with Daur-e-Hadees Mufti and Qazi are
          also made here.
        </Text>

        <Text style={styles.subTitle}>Place of Establishment</Text>
        <Text style={styles.paragraph}>
          The Madrasa is Located in Sr.No.42, Kondhwa Khurd, Pune-48,
          Maharashtra, INDIA.
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 16,
    color: "#34495e",
    lineHeight: 24,
    marginBottom: 12,
  },
});
