import React, { useRef, useCallback } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { useApp } from "../context/AppContext";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";

import CalendarItem from "../components/CalendarItem";
import MonthSelectorModal from "../components/MonthSelectorModal";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import SettingsModal from "../components/SettingsModal";
import RemindersModal from "../components/RemindersModal";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  const {
    // State
    currentMonthIndex,
    isScrollEnabled,
    showBack,
    isMonthSelectorVisible,
    isSettingsVisible,
    isRemindersVisible,
    calendarData,

    // Actions
    setCurrentMonthIndex,
    setIsScrollEnabled,
    openMonthSelector,
    closeMonthSelector,
    openSettings,
    closeSettings,
    openReminders,
    closeReminders,
    toggleFlip,
    setMonthIndex,
  } = useApp();

  // Scroll to month when selected from modal (if needed effectively)
  // Note: We handle the scroll in onSelectMonth wrapper below.

  // Calculate dimensions once
  const isSmallDevice = width < 375;
  const paddingH = isSmallDevice ? 24 : 16; // 16 is LAYOUT.spacing.m
  const maxWidth = width - paddingH;
  // Fallback height if we don't know aspect ratio (mostly portrait A4ish)
  // height * 0.7 or 0.8
  const availableH =
    Dimensions.get("window").height * (isSmallDevice ? 0.7 : 0.8);
  const maxHeight = availableH - (isSmallDevice ? 10 : 20);

  const renderItem = useCallback(
    ({ item }) => (
      <CalendarItem
        item={item}
        showBack={showBack}
        setIsScrollEnabled={setIsScrollEnabled}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
      />
    ),
    [showBack, setIsScrollEnabled, maxWidth, maxHeight],
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    // Only update if changed to avoid unnecessary re-renders
    if (index !== currentMonthIndex) {
      setCurrentMonthIndex(index);
    }
  };

  const onSelectMonth = (index) => {
    closeMonthSelector();
    if (index >= 0 && index < calendarData.length) {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
      setMonthIndex(index);
    }
  };

  const currentItem = calendarData[currentMonthIndex];
  const hasBackImage = currentItem?.backImage?.uri;

  const handleDatePress = () => {
    const today = new Date();
    // Assuming 2026 is the target year as per data
    const targetMonthIndex = today.getMonth(); // 0-11

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: targetMonthIndex,
        animated: true,
      });
    }
    setMonthIndex(targetMonthIndex);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ExpoStatusBar
        style="dark"
        backgroundColor="transparent"
        translucent={true}
      />

      <Header
        topInset={insets.top}
        monthName={currentItem?.monthName}
        hasBackImage={hasBackImage}
        onPressDate={handleDatePress}
      />

      <View style={styles.contentContainer}>
        <FlatList
          ref={flatListRef}
          data={calendarData}
          scrollEnabled={isScrollEnabled}
          style={styles.flatList}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={currentMonthIndex}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          keyExtractor={keyExtractor}
          // Remove extraData={showBack} as CalendarItem uses Context now (will be updated next)
          // actually CalendarItem is pure/memo, so it might need context usage to re-render?
          // We will update CalendarItem to use context, so it will re-render on context change.
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={renderItem}
        />
      </View>

      <BottomNav />

      <MonthSelectorModal
        visible={isMonthSelectorVisible}
        onClose={closeMonthSelector}
        data={calendarData}
        currentMonthIndex={currentMonthIndex}
        onSelectMonth={onSelectMonth}
      />

      <SettingsModal visible={isSettingsVisible} onClose={closeSettings} />

      <RemindersModal visible={isRemindersVisible} onClose={closeReminders} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  flatList: {
    flex: 1,
  },
});
