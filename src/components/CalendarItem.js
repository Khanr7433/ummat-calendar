import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { ReactNativeZoomableView } from "@dudigital/react-native-zoomable-view";
import React, { memo, useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { useScreenDimensions } from "../hooks/useScreenDimensions";
import { COLORS } from "../constants/colors";
import { LAYOUT } from "../constants/layout";

const CalendarItem = memo(({ item }) => {
  const { showBack, setIsScrollEnabled } = useApp();
  const { width, height, isSmallDevice } = useScreenDimensions();
  const [containerHeight, setContainerHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [loading, setLoading] = useState(true);

  // Reset loading state when the item or side changes
  React.useEffect(() => {
    setLoading(true);
  }, [showBack, item]);

  const containerStyle = useMemo(
    () => ({
      width: width,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    }),
    [width],
  );

  const finalImageDimensions = useMemo(() => {
    const paddingH = isSmallDevice ? 24 : LAYOUT.spacing.m;
    const maxWidth = width - paddingH;

    // Use actual Measured container height if available, otherwise fallback to safe percentage
    const availableH =
      containerHeight > 0
        ? containerHeight
        : height * (isSmallDevice ? 0.7 : 0.8);

    // Subtract a small buffer to ensure no touching edges
    const maxHeight = availableH - (isSmallDevice ? 10 : 20);

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
  }, [width, height, isSmallDevice, aspectRatio, containerHeight]);

  const imageStyle = useMemo(
    () => ({
      ...styles.image,
      width: finalImageDimensions.width,
      height: finalImageDimensions.height,
      opacity: loading ? 0 : 1,
    }),
    [finalImageDimensions, loading],
  );

  return (
    <View
      style={containerStyle}
      onLayout={(e) => {
        const { height } = e.nativeEvent.layout;
        if (height > 0 && Math.abs(height - containerHeight) > 1) {
          setContainerHeight(height);
        }
      }}
    >
      <ReactNativeZoomableView
        maxZoom={3}
        minZoom={1}
        zoomStep={0.5}
        initialZoom={1}
        bindToBorders={true}
        style={styles.zoomableView}
        onZoomAfter={(event, gestureState, zoomableViewEventObject) => {
          if (zoomableViewEventObject.zoomLevel > 1) {
            setIsScrollEnabled(false);
          } else {
            setIsScrollEnabled(true);
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
