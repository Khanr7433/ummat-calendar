import React from "react";
import { StyleSheet } from "react-native";
import { FlexWidget, TextWidget } from "react-native-android-widget";

export function CircularClockWidget({
  time,
  topDateText,
  hijriDateText,
  bottomText,
}) {
  return (
    <FlexWidget style={styles.container}>
      <FlexWidget style={styles.contentContainer}>
        {/* Top: Gregorian Date (Urdu) */}
        <TextWidget text={topDateText} style={styles.topDateText} />

        {/* Second: Hijri Date */}
        <TextWidget text={hijriDateText} style={styles.hijriDateText} />

        {/* Center: Time */}
        <TextWidget text={time} style={styles.timeText} />

        {/* Bottom: Label/Location */}
        <TextWidget text={bottomText} style={styles.bottomText} />
      </FlexWidget>
    </FlexWidget>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "match_parent",
    width: "match_parent",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000000", // Transparent background for container
  },
  contentContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "match_parent",
    width: "match_parent",
    borderRadius: 160, // Circular
    backgroundColor: "#1a1a1a", // Dark background
    borderColor: "#ffffff",
    borderWidth: 2,
    padding: 16,
  },
  topDateText: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 4,
    // fontFamily: 'Jameel Noori Nastaleeq', // Not available
  },
  hijriDateText: {
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 16,
    // fontFamily: 'Jameel Noori Nastaleeq',
  },
  timeText: {
    fontSize: 48, // Big Time
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 16,
  },
  bottomText: {
    fontSize: 14,
    color: "#cccccc", // Slightly dimmer
  },
});
