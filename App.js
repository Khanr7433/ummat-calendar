import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CustomSplashScreen from "./src/screens/CustomSplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { ReminderService } from "./src/services/ReminderService";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    ReminderService.initialize();
    ReminderService.rescheduleAllReminders();
  }, []);

  if (!appIsReady) {
    return <CustomSplashScreen onFinish={() => setAppIsReady(true)} />;
  }

  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
