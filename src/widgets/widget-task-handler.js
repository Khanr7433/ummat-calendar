import React from "react";
import { CircularClockWidget } from "./CircularClockWidget";

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

// Helper to convert English digits to Urdu digits
const toUrduDigits = (str) => {
  const id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (w) => id[+w]);
};

// Simplified Hijri Date Fetcher (replicating DateService logic roughly for widget)
// In a real app, you might want to share this data via AsyncStorage or SharedPrefs completely,
// but for a widget, standalone fetch is often more reliable if background restrictions allow.
// Ideally, the main app should fetch and store 'today's data' in a shared storage that the widget reads.
// For now, we'll try to calculate/fetch or use a fallback.
async function getHijriDate(date) {
  try {
    // Fallback offline calculation (similar to DateService.getOfflineHijriDate)
    // Using -1 or -2 adjustment as per DateService logic
    const adjustedDate = new Date(date);
    adjustedDate.setDate(date.getDate() - 1);

    const formatted = new Intl.DateTimeFormat("en-GB-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(adjustedDate);

    // Format: "23 Shaban 1447 AH" -> remove AH
    let clean = formatted.replace(" AH", "").trim();

    // Improve Urdu mapping for Hijri months if possible, or return English for now
    // The image shows "1447 شعبان 23".
    // We need to parse "23 Shaban 1447"

    const parts = clean.split(" ");
    if (parts.length >= 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];

      // Normalize month name: NFD decompose, then keep only ASCII letters/spaces/hyphens
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
      return `${day} ${urduMonth} ${year}`; // 24 شعبان 1447
    }

    return clean;
  } catch (e) {
    return "";
  }
}

const nameToWidget = {
  CircularClock: async (props) => {
    const now = new Date();

    // English Time (Center Big)
    // English Time (Center Big) - Force English Digits
    let hours = now.getHours();
    const minutes = now.getMinutes();

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const hStr = hours.toString().padStart(2, "0");
    const mStr = minutes.toString().padStart(2, "0");

    const time = `${hStr}:${mStr}`;
    // Actually image has "01:27" in big text and "PM 04:57" below.
    // Usually big clocks are 12h or 24h. Let's stick to 24h or 12h padded.
    // 01:27 suggests padded hour.

    // Top Row: Urdu Date "February 12 Thursday" -> "فروری 12 جمعرات"
    const dayNameEng = now.toLocaleDateString("en-US", { weekday: "long" });
    const monthNameEng = now.toLocaleDateString("en-US", { month: "long" });
    const dateNum = now.getDate();

    const dayNameUrdu = urduDays[dayNameEng] || dayNameEng;
    const monthNameUrdu = urduMonths[monthNameEng] || monthNameEng;

    // RTL order: date number first from right -> "جمعہ فروری 13"
    const topDateText = `${dayNameUrdu} ${dateNum} ${monthNameUrdu}`;

    // Second Row: Hijri Date "1447 شعبان 23"
    const hijriDateText = await getHijriDate(now);

    // Bottom Row: Prayer Time (Mocking or fetching?)
    // Since we don't have easy access to the configured location and prayer calculation logic here
    // (it's in the app context/services which might depend on libraries not available in the headless task or require context),
    // we might skip valid prayer times for now or put a placeholder/current time.
    // The image shows "PM 04:57 عصر".
    // Let's try to just show "Ummat Calendar" or location if available?
    // Image has "Kondhwa ..." and "PM 04:57 عصر".
    // For now, let's put a static location or just "Ummat" and maybe the next prayer if we can calculate it.
    // Without `adhan` library or similar in the widget handler, we can't calc easily.
    // We will leave the bottom text generic or remove it to avoid wrong info.
    // Or we can display the current time with AM/PM there as a secondary display?
    // Image implies: Top=Gregorian, Below=Hijri, Center=Time, Below=Location, Bottom=NextPrayer.

    // We will stick to:
    // Top: Gregorian Urdu
    // Below: Hijri
    // Center: Time
    // Bottom: "Ummat Calendar" (instead of location/prayer for now to be safe)

    return (
      <CircularClockWidget
        time={time}
        topDateText={topDateText}
        hijriDateText={hijriDateText}
        bottomText="Ummat Calendar"
      />
    );
  },
};

export async function widgetTaskHandler(props) {
  const widgetInfo = props.widgetInfo;
  const WidgetComponent = nameToWidget[widgetInfo.widgetName];

  if (WidgetComponent) {
    // Note: WidgetComponent is async now
    const rendered = await WidgetComponent(props);
    props.renderWidget(rendered);
  }
}
