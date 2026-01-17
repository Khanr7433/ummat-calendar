import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { ReactNativeZoomableView } from "@dudigital/react-native-zoomable-view";
import React, { memo, useState, useMemo } from "react";
import { useScreenDimensions } from "../hooks/useScreenDimensions";
import { COLORS } from "../constants/colors";
import { LAYOUT } from "../constants/layout";

const CalendarItem = memo(({ item, showBack, onZoomChange }) => {
  const { width, height, isSmallDevice } = useScreenDimensions();
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

  const finalImageDimensions = useMemo(() => {
    const paddingH = isSmallDevice ? 24 : LAYOUT.spacing.m;
    const maxWidth = width - paddingH;

    const heightPercent = isSmallDevice
      ? parseFloat(LAYOUT.calendarItem.reducedImageHeightPercentage) / 100
      : parseFloat(LAYOUT.calendarItem.fullImageHeightPercentage) / 100;

    const maxHeight = height * heightPercent;

    if (!aspectRatio) {
      return { width: maxWidth, height: maxHeight };
    }

    const heightAtMaxWidth = maxWidth / aspectRatio;

    if (heightAtMaxWidth <= maxHeight) {
      return { width: maxWidth, height: heightAtMaxWidth };
    } else {
      const widthAtMaxHeight = maxHeight * aspectRatio;
      return { width: widthAtMaxHeight, height: maxHeight };
    }
  }, [width, height, isSmallDevice, aspectRatio]);

  const imageStyle = useMemo(
    () => ({
      ...styles.image,
      width: finalImageDimensions.width,
      height: finalImageDimensions.height,
    }),
    [finalImageDimensions]
  );

  return (
    <View style={containerStyle}>
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
        movementSensibility={1.3}
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
    backgroundColor: COLORS.white,
    borderRadius: 0,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: "visible",
    padding: 0,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
    marginTop: -15,
    marginLeft: -15,
  },
  image: {
    borderRadius: 0,
  },
});

export default CalendarItem;
