import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CustomSplashScreen from "./src/screens/CustomSplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { AppProvider } from "./src/context/AppContext";
import { ReminderService } from "./src/services/ReminderService";
import { checkAppUpdate } from "./src/services/InAppUpdate";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    ReminderService.initialize();
    ReminderService.rescheduleAllReminders();
    checkAppUpdate();
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
