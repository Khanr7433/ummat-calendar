import { useState, useEffect } from "react";
import { Dimensions } from "react-native";
import { LAYOUT } from "../constants/layout";

export const useScreenDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const isSmallDevice = dimensions.height < LAYOUT.smallDeviceHeight;

  return {
    ...dimensions,
    isSmallDevice,
  };
};
