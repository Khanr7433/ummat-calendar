import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { ReactNativeZoomableView } from "@dudigital/react-native-zoomable-view";
import React, { memo, useState, useMemo } from "react";
import { useScreenDimensions } from "../hooks/useScreenDimensions";
import { COLORS } from "../constants/colors";
import { LAYOUT } from "../constants/layout";

const CalendarItem = memo(({ item, showBack, onZoomChange }) => {
  const { width, isSmallDevice } = useScreenDimensions();
  const [aspectRatio, setAspectRatio] = useState(null);
  const [loading, setLoading] = useState(true);

  const containerStyle = useMemo(
    () => ({
      width: width,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    }),
    [width]
  );

  const imageStyle = useMemo(
    () => [
      styles.image,
      {
        width: width - LAYOUT.spacing.m, // More breathing room
        height: LAYOUT.calendarItem.fullImageHeightPercentage,
      },
      isSmallDevice && {
        width: width - 24, // Consistent padding
        height: LAYOUT.calendarItem.reducedImageHeightPercentage,
        marginTop: LAYOUT.calendarItem.smallDeviceMarginTop,
      },
      aspectRatio && { aspectRatio, height: undefined },
    ],
    [width, isSmallDevice, aspectRatio]
  );

  return (
    <View style={containerStyle}>
      <ReactNativeZoomableView
        maxZoom={3} // Increased zoom for better readability
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
        movementSensibility={1.3} // Smoother panning
      >
        <View style={styles.cardContainer}>
          {loading && (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={styles.loader}
            />
          )}
          <Image
            source={showBack ? item.backImage : item.frontImage}
            style={imageStyle}
            contentFit="contain"
            quality={100}
            cachePolicy="disk"
            onLoad={(e) => {
              setLoading(false);
              const { width, height } = e.source;
              if (width && height) {
                setAspectRatio(width / height);
              }
            }}
            onError={() => setLoading(false)}
          />
        </View>
      </ReactNativeZoomableView>
    </View>
  );
});

const styles = StyleSheet.create({
  zoomableView: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    // Premium Card Look
    backgroundColor: COLORS.white,
    borderRadius: 0, // No radius as requested

    // Soft Shadow (All Sides)
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 0 }, // Center shadow
    shadowOpacity: 0.25, // Slightly stronger opacity
    shadowRadius: 20, // Larger radius to spread out
    elevation: 10, // Higher elevation for Android

    overflow: "visible",
    padding: 0,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
    marginTop: -15, // Half of size "large" roughly
    marginLeft: -15,
  },
  image: {
    borderRadius: 0,
  },
});

export default CalendarItem;
