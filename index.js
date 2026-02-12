import { registerRootComponent } from "expo";
import { registerWidgetTaskHandler } from "react-native-android-widget";
// import { widgetTaskHandler } from "./src/widgets/widget-task-handler";

import App from "./App";

// registerWidgetTaskHandler(widgetTaskHandler); // Legacy widget handler removed

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
