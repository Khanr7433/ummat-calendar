export const urduMonths = {
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

export const urduDays = {
  Sunday: "اتوار",
  Monday: "پیر",
  Tuesday: "منگل",
  Wednesday: "بدھ",
  Thursday: "جمعرات",
  Friday: "جمعہ",
  Saturday: "سنیچر",
};

export const hijriMonthsUrdu = {
  default: {
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
  },
};

export const normalizeDateString = (s) => {
  return s
    .normalize("NFD")
    .replace(/[^a-zA-Z -]/g, "")
    .trim()
    .toLowerCase();
};
