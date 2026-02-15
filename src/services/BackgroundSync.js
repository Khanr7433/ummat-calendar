import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import WidgetSyncService from "./WidgetSyncService";
import { APP_CONFIG } from "../constants/Config";

const BACKGROUND_SYNC_TASK = APP_CONFIG.TASKS.BACKGROUND_DATE_SYNC;

// Define the task
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log(`[BackgroundSync] Task ${BACKGROUND_SYNC_TASK} running...`);
    const dateData = await WidgetSyncService.sync();
    console.log("[BackgroundSync] Sync completed:", dateData);
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("[BackgroundSync] Sync failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Configure and register the task
export async function registerBackgroundSync() {
  try {
    const isRegistered =
      await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    if (!isRegistered) {
      console.log(`[BackgroundSync] Registering task ${BACKGROUND_SYNC_TASK}`);
      await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
        minimumInterval: 60 * 15, // 15 minutes
        stopOnTerminate: false, // Continue running after app close
        startOnBoot: true, // Run on device restart
      });
    } else {
      console.log(
        `[BackgroundSync] Task ${BACKGROUND_SYNC_TASK} already registered`,
      );
    }
  } catch (err) {
    console.error(`[BackgroundSync] Register failed:`, err);
  }
}
