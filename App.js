import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CustomSplashScreen from "./src/screens/CustomSplashScreen";
import HomeScreen from "./src/screens/HomeScreen";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  if (!appIsReady) {
    return <CustomSplashScreen onFinish={() => setAppIsReady(true)} />;
  }

  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
