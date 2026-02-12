import React from "react";
import { StyleSheet } from "react-native";
import { FlexWidget, TextWidget } from "react-native-android-widget";

export function CircularClockWidget({
  date,
  month,
  year,
  time,
  timeUrdu,
  monthUrdu,
  dayUrdu,
}) {
  return (
    <FlexWidget style={styles.container}>
      <FlexWidget style={styles.contentContainer}>
        {/* English Time */}
        <TextWidget text={time} style={styles.timeText} />

        {/* Urdu Time */}
        <TextWidget text={timeUrdu} style={styles.urduTimeText} />

        {/* Date Row */}
        <FlexWidget style={styles.dateRow}>
          <TextWidget
            text={`${date} ${month} ${year}`}
            style={styles.dateText}
          />
        </FlexWidget>

        {/* Urdu Date Row */}
        <FlexWidget style={styles.dateRow}>
          <TextWidget
            text={`${dayUrdu} ${monthUrdu} ${year}`}
            style={styles.urduDateText}
          />
        </FlexWidget>
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
    backgroundColor: "#ffffff",
    borderRadius: 160, // Make it circular, half of 320 (typical widget size) or simpler to use a large number
  },
  contentContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "match_parent",
    width: "match_parent",
    borderRadius: 160,
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    borderWidth: 2,
  },
  timeText: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "bold",
  },
  urduTimeText: {
    fontSize: 24,
    color: "#000000",
    fontWeight: "bold",
    marginTop: 4,
  },
  dateRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#333333",
  },
  urduDateText: {
    fontSize: 16,
    color: "#333333",
    // fontFamily: "Jameel Noori Nastaleeq", // Font not available
    marginTop: 2,
  },
});
