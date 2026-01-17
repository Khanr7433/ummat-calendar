import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

export const LAYOUT = {
  smallDeviceHeight: 700,
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  calendarItem: {
    reducedImageHeightPercentage: "75%",
    fullImageHeightPercentage: "100%",
    smallDeviceMarginTop: 0,
  },
};
