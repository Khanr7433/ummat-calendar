import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import calendarData from "./src/data/calendarData";
import CalendarItem from "./src/components/CalendarItem";
import MonthSelectorModal from "./src/components/MonthSelectorModal";

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get("window");

export default function App() {
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const initialMonthIndex = currentYear >= 2026 ? currentDate.getMonth() : 0;

  const [currentMonthIndex, setCurrentMonthIndex] = useState(initialMonthIndex);

  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

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

  return (
    <View style={styles.container}>
      <ExpoStatusBar
        style="dark"
        backgroundColor="#ffffff"
        translucent={false}
      />

      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>
          {calendarData[currentMonthIndex]?.monthName || "Select Month"} ▾
        </Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={calendarData}
        scrollEnabled={isScrollEnabled}
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialMonthIndex}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        removeClippedSubviews={true}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <CalendarItem item={item} onZoomChange={setIsScrollEnabled} />
        )}
      />

      <MonthSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={calendarData}
        currentMonthIndex={currentMonthIndex}
        onSelectMonth={onSelectMonth}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 30,
  },
  selectorButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 30,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
  selectorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    letterSpacing: 0.5,
  },
});
