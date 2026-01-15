import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, Easing, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

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

        await new Promise((resolve) => setTimeout(resolve, 5000));
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
        <Text style={styles.splashTextSubtitle}>
          BY:{" "}
          <Text style={styles.splashTextSubtitleBold}>
            MADRASA BAITUL ULOOM
          </Text>
          {"\n"}
          <Text style={styles.splashTextSubtitleBold}>
            KONDHWA, PUNE, 411048
          </Text>
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
    backgroundColor: "#ffffff",
  },
  splashImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  splashTextTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2c3e50",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 1.2,
  },
  splashTextSubtitle: {
    fontSize: 15,
    color: "#95a5a6",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  splashTextSubtitleBold: {
    fontWeight: "bold",
  },
});
