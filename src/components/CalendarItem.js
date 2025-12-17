import { View, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { ReactNativeZoomableView } from "@dudigital/react-native-zoomable-view";
import React, { memo } from "react";

const { width } = Dimensions.get("window");

const CalendarItem = memo(({ item, onZoomChange }) => {
  return (
    <View style={styles.container}>
      <ReactNativeZoomableView
        maxZoom={3}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        style={styles.zoomableView}
        onZoomAfter={(event, gestureState, zoomableViewEventObject) => {
          if (zoomableViewEventObject.zoomLevel > 1) {
            onZoomChange(false);
          } else {
            onZoomChange(true);
          }
        }}
      >
        <Image
          source={item.image}
          style={styles.image}
          contentFit="contain"
          transition={500}
          quality={100}
        />
      </ReactNativeZoomableView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  zoomableView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: width,
    height: "100%",
  },
});

export default CalendarItem;
