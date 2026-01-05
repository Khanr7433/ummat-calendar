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
      styles.staticImage,
      {
        width: width - LAYOUT.spacing.s,
        height: LAYOUT.calendarItem.fullImageHeightPercentage,
      },
      isSmallDevice && {
        width: width - 20,
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
        maxZoom={2}
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
        {loading && (
          <ActivityIndicator
            size="large"
            color={COLORS.black}
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
  loader: {
    position: "absolute",
    zIndex: 1,
  },
  staticImage: {
    borderWidth: 1,
    borderColor: COLORS.black,
  },
});

export default CalendarItem;
