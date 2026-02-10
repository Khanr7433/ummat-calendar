import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CustomSplashScreen from "./src/screens/CustomSplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { AppProvider } from "./src/context/AppContext";
import { ReminderService } from "./src/services/ReminderService";
import DailyNotificationService from "./src/services/DailyNotificationService";
import { checkAppUpdate } from "./src/services/InAppUpdate";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      ReminderService.initialize();
      ReminderService.rescheduleAllReminders();
      await DailyNotificationService.refresh();
      checkAppUpdate();
    };
    init();
  }, []);

  if (!appIsReady) {
    return <CustomSplashScreen onFinish={() => setAppIsReady(true)} />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <HomeScreen />
      </AppProvider>
    </SafeAreaProvider>
  );
}
