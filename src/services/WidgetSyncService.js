import DefaultPreference from "react-native-default-preference";
import { NativeModules } from "react-native";
import DateService from "./DateService";

const WIDGET_TOP_DATE_KEY = "widget_top_date";
const WIDGET_HIJRI_DATE_KEY = "widget_hijri_date";

// ... (mappings remain same) ...

// Mapping for English to Urdu months
const urduMonths = {
  January: "جنوری",
  February: "فروری",
  March: "مارچ",
  April: "اپریل",
  May: "مئی",
  June: "جون",
  July: "جولائی",
  August: "اگست",
  September: "ستمبر",
  October: "اکتوبر",
  November: "نومبر",
  December: "دسمبر",
};

// Mapping for English to Urdu days
const urduDays = {
  Sunday: "اتوار",
  Monday: "پیر",
  Tuesday: "منگل",
  Wednesday: "بدھ",
  Thursday: "جمعرات",
  Friday: "جمعہ",
  Saturday: "سنیچر",
};

class WidgetSyncService {
  async sync() {
    try {
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

        const normalize = (s) =>
          s
            .normalize("NFD")
            .replace(/[^a-zA-Z -]/g, "")
            .trim()
            .toLowerCase();

        const hijriMonthsUrdu = {
          muharram: "محرم",
          safar: "صفر",
          "rabi i": "ربیع الاول",
          "rabi ii": "ربیع الثانی",
          "jumada i": "جمادی الاول",
          "jumada ii": "جمادی الثانی",
          rajab: "رجب",
          shaban: "شعبان",
          ramadan: "رمضان",
          shawwal: "شوال",
          "dhu al-qadah": "ذو القعدہ",
          "dhu al-hijjah": "ذو الحجہ",
        };
        const normalizedMonth = normalize(month);
        const urduMonth = hijriMonthsUrdu[normalizedMonth] || month;
        hijriDateText = `${day} ${urduMonth} ${year}`;
      }

      // 3. Save to Shared Preferences
      await DefaultPreference.setName("react-native");
      await DefaultPreference.set(WIDGET_TOP_DATE_KEY, topDateText);
      await DefaultPreference.set(WIDGET_HIJRI_DATE_KEY, hijriDateText);

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
