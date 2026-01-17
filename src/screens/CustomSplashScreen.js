import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, Easing, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { COLORS } from "../constants/colors";
import { TOPOGRAPHY } from "../constants/typography";

SplashScreen.preventAutoHideAsync({
  fade: true,
  duration: 50,
});

export default function CustomSplashScreen({ onFinish }) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        await SplashScreen.hideAsync();

        // Start animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
          }),
        ]).start();

        await new Promise((resolve) => setTimeout(resolve, 4000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Fade out before finishing
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onFinish());
      }
    }

    prepare();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <Animated.Image
        source={require("../../assets/icon.png")}
        style={[
          styles.splashImage,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        <Text style={styles.splashTextTitle}>UMMAT CALENDAR</Text>
        <View style={styles.divider} />
        <Text style={styles.splashTextSubtitle}>
          BY{"\n"}
          <Text style={styles.splashTextSubtitleBold}>
            MADRASA BAITUL ULOOM
          </Text>
          {"\n"}KONDHWA, PUNE-48
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  splashImage: {
    width: 180,
    height: 180,
    marginBottom: 32,
  },
  splashTextTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary, // Using Brand Color
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  divider: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.secondary, // Subtle divider
    borderRadius: 2,
    marginBottom: 16,
  },
  splashTextSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 2,
    lineHeight: 20,
    textTransform: "uppercase",
  },
  splashTextSubtitleBold: {
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
});
