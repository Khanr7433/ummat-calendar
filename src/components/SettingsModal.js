import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import AboutView from "./AboutView";
import PrivacyView from "./PrivacyView";
import MenuView from "./MenuView";

import ModalContainer from "./ui/ModalContainer";
import ModalHeader from "./ui/ModalHeader";

export default function SettingsModal({ visible, onClose }) {
  const [currentView, setCurrentView] = useState("menu");

  const resetState = () => {
    setCurrentView("menu");
  };

  const handleRequestClose = () => {
    if (currentView !== "menu") {
      setCurrentView("menu");
    } else {
      onClose();
      setTimeout(resetState, 200);
    }
  };

  const handleCloseButton = () => {
    onClose();
    setTimeout(resetState, 200);
  };

  const isMenu = currentView === "menu";
  const headerTitle =
    currentView === "menu"
      ? "Settings"
      : currentView === "about"
      ? "About Us"
      : "Privacy Policy";

  const renderContent = () => {
    switch (currentView) {
      case "about":
        return <AboutView onBack={() => setCurrentView("menu")} />;
      case "privacy":
        return <PrivacyView onBack={() => setCurrentView("menu")} />;
      default:
        return (
          <MenuView
            onAboutPress={() => setCurrentView("about")}
            onPrivacyPress={() => setCurrentView("privacy")}
          />
        );
    }
  };

  const handleLeftPress = isMenu
    ? handleCloseButton
    : () => setCurrentView("menu");

  return (
    <ModalContainer visible={visible} onRequestClose={handleRequestClose}>
      <ModalHeader
        title={headerTitle}
        leftIcon="arrow-back"
        onLeftPress={handleLeftPress}
      />
      <View style={styles.contentContainer}>{renderContent()}</View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
