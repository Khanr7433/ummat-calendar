import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from "sp-react-native-in-app-updates";
import { Platform } from "react-native";

const inAppUpdates = new SpInAppUpdates(
  false, // isDebug
);

export const checkAppUpdate = async () => {
  if (Platform.OS !== "android") return;

  try {
    const result: NeedsUpdateResponse = await inAppUpdates.checkNeedsUpdate();

    if (result.shouldUpdate) {
      const updateOptions: StartUpdateOptions = {
        updateType: IAUUpdateKind.FLEXIBLE,
      };

      await inAppUpdates.startUpdate(updateOptions);
    }
  } catch (error) {
    console.log("Error checking for updates:", error);
  }
};
