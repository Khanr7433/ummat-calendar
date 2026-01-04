import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRef, useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import calendarData from "./src/data/calendarData";
import CalendarItem from "./src/components/CalendarItem";
import MonthSelectorModal from "./src/components/MonthSelectorModal";

SplashScreen.preventAutoHideAsync({
  fade: true,
  duration: 50,
});

const { width } = Dimensions.get("window");

function CalendarContent() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 50));
        await SplashScreen.hideAsync();

        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
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

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require("./assets/icon.png")}
          style={styles.splashImage}
          resizeMode="contain"
        />
        <Text style={styles.splashTextTitle}>Ummat Calendar</Text>
        <Text style={styles.splashTextSubtitle}>
          by : Madarsa Baitul Uloom, Pune
        </Text>
      </View>
    );
  }

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

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ExpoStatusBar
        style="dark"
        backgroundColor="transparent"
        translucent={true}
      />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectorText}>
            {calendarData[currentMonthIndex]?.monthName || "Select Month"} ▾
          </Text>
        </TouchableOpacity>

        {hasBackImage && (
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setShowBack(!showBack)}
          >
            <Text style={styles.flipButtonText}>
              {showBack ? "Show Front" : "Show Back"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={calendarData}
        scrollEnabled={isScrollEnabled}
        style={[styles.flatList, { marginTop: insets.bottom }]}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialMonthIndex}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
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

      <MonthSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={calendarData}
        currentMonthIndex={currentMonthIndex}
        onSelectMonth={onSelectMonth}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CalendarContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    letterSpacing: 0.3,
  },
  flipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  flipButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
  },
  flatList: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  splashImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  splashTextTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
    textAlign: "center",
  },
  splashTextSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    fontWeight: "500",
    textAlign: "center",
  },
});
