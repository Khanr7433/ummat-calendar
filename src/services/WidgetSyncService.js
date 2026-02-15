import DefaultPreference from "react-native-default-preference";
import { NativeModules } from "react-native";
import DateService from "./DateService";
import {
  urduMonths,
  urduDays,
  hijriMonthsUrdu,
  normalizeDateString,
} from "../utils/UrduDateUtils";
import { APP_CONFIG } from "../constants/Config";

// ... (mappings remain same) ...

class WidgetSyncService {
  constructor() {
    this.lastSyncTime = 0;
    this.MIN_SYNC_INTERVAL = 10000; // 10 seconds
  }

  async sync(force = false) {
    try {
      const nowTime = Date.now();
      if (!force && nowTime - this.lastSyncTime < this.MIN_SYNC_INTERVAL) {
        console.log("Skipping Widget Sync (Throttled)");
        return;
      }
      this.lastSyncTime = nowTime;

      const now = new Date();

      // 1. Calculate Top Date (Gregorian Urdu)
      const dayNameEng = now.toLocaleDateString("en-US", { weekday: "long" });
      const monthNameEng = now.toLocaleDateString("en-US", { month: "long" });
      const dateNum = now.getDate();

      const dayNameUrdu = urduDays[dayNameEng] || dayNameEng;
      const monthNameUrdu = urduMonths[monthNameEng] || monthNameEng;

      const topDateText = `${dayNameUrdu} ${dateNum} ${monthNameUrdu}`;

      // 2. Calculate Hijri Date
      const dateData = await DateService.getDateData(now, true);
      let hijriDateText = dateData?.hijri || "";

      if (!hijriDateText) {
        hijriDateText = DateService.getOfflineHijriDate(now);
      }

      const parts = hijriDateText.replace("AH", "").trim().split(" ");
      if (parts.length >= 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        // Use utility for normalization
        const normalizedMonth = normalizeDateString(month);
        const urduMonth = hijriMonthsUrdu.default[normalizedMonth] || month;
        hijriDateText = `${day} ${urduMonth} ${year}`;
      }

      // 3. Save to Shared Preferences
      await DefaultPreference.setName(APP_CONFIG.SHARED_PREFS_NAME);
      await DefaultPreference.set(APP_CONFIG.WIDGET_KEYS.TOP_DATE, topDateText);
      await DefaultPreference.set(
        APP_CONFIG.WIDGET_KEYS.HIJRI_DATE,
        hijriDateText,
      );

      console.log("Widget Data Synced:", topDateText, hijriDateText);

      // 4. Force Widget Update
      if (NativeModules.WidgetHelper) {
        NativeModules.WidgetHelper.forceUpdate();
        console.log("Widget Update Triggered via Native Module");
      } else {
        console.warn("WidgetHelper Native Module not found");
      }
    } catch (error) {
      console.warn("Failed to sync widget data:", error);
    }
  }
}

export default new WidgetSyncService();
