import React from "react";
import { CircularClockWidget } from "./CircularClockWidget";

const nameToWidget = {
  // HelloWidget will be the name of the widget we define in app.json
  CircularClock: (props) => {
    const now = new Date();

    // Format English
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const date = now.getDate();
    const month = now.toLocaleString("en-US", { month: "long" });
    const year = now.getFullYear();

    // Format Urdu
    // Note: React Native's Intl support depends on the engine (Hermes supports it).
    // If not, we might need manual mapping. Assuming Hermes is enabled.
    const timeUrdu = now.toLocaleTimeString("ur-PK", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const monthUrdu = now.toLocaleString("ur-PK", { month: "long" });
    const dayUrdu = now.getDate().toLocaleString("ur-PK"); // Just the number in Urdu digits if locale works

    return (
      <CircularClockWidget
        date={date}
        month={month}
        year={year}
        time={time}
        timeUrdu={timeUrdu}
        monthUrdu={monthUrdu}
        dayUrdu={dayUrdu}
      />
    );
  },
};

export async function widgetTaskHandler(props) {
  const widgetInfo = props.widgetInfo;
  const WidgetComponent = nameToWidget[widgetInfo.widgetName];

  if (WidgetComponent) {
    props.renderWidget(<WidgetComponent />);
  }
}
