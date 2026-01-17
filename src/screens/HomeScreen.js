import React, { useRef, useState, useCallback, useEffect } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

import calendarData from "../data/calendarData";
import CalendarItem from "../components/CalendarItem";
import MonthSelectorModal from "../components/MonthSelectorModal";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import SettingsModal from "../components/SettingsModal";
import RemindersModal from "../components/RemindersModal";
import { ReminderService } from "../services/ReminderService";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [remindersVisible, setRemindersVisible] = useState(false);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const actionId = response.actionIdentifier;
        if (actionId === "SNOOZE") {
          await ReminderService.snoozeReminder(
            response.notification.request.content
          );
        }
      }
    );

    return () => subscription.remove();
  }, []);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const initialMonthIndex = currentYear >= 2026 ? currentDate.getMonth() : 0;

  const [currentMonthIndex, setCurrentMonthIndex] = useState(initialMonthIndex);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const renderItem = useCallback(
    ({ item }) => (
      <CalendarItem
        item={item}
        showBack={showBack}
        onZoomChange={setIsScrollEnabled}
      />
    ),
    [showBack]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentMonthIndex(index);
  };

  const onSelectMonth = (index) => {
    setModalVisible(false);

    if (index >= 0 && index < calendarData.length) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setCurrentMonthIndex(index);
    }
  };

  const currentItem = calendarData[currentMonthIndex];
  const hasBackImage = currentItem?.backImage?.uri;

  const handleSelectMonthPress = useCallback(() => setModalVisible(true), []);
  const handleSettingsPress = useCallback(() => setSettingsVisible(true), []);
  const handleRemindersPress = useCallback(() => setRemindersVisible(true), []);
  const handleFlipToggle = useCallback(
    () => setShowBack(!showBack),
    [showBack]
  );

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ExpoStatusBar
        style="dark"
        backgroundColor="transparent"
        translucent={true}
      />

      <Header
        monthName={calendarData[currentMonthIndex]?.monthName}
        onSelectMonthPress={handleSelectMonthPress}
        showBack={showBack}
        onFlipToggle={handleFlipToggle}
        hasBackImage={hasBackImage}
        topInset={insets.top}
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
          initialScrollIndex={initialMonthIndex}
          initialNumToRender={3}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          keyExtractor={keyExtractor}
          extraData={showBack}
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

      <BottomNav
        onSettingsPress={handleSettingsPress}
        onRemindersPress={handleRemindersPress}
      />

      <MonthSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={calendarData}
        currentMonthIndex={currentMonthIndex}
        onSelectMonth={onSelectMonth}
      />

      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />

      <RemindersModal
        visible={remindersVisible}
        onClose={() => setRemindersVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  flatList: {
    flex: 1,
  },
});
