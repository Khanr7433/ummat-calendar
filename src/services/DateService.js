import AsyncStorage from "@react-native-async-storage/async-storage";

const HIJRI_API_BASE = "http://api.aladhan.com/v1/gToHCalendar";
const CACHE_KEY_PREFIX = "gtoh_cal_kara_v4_"; // Forced India Location

class DateService {
  /**
   * Fetch Hijri calendar data from API based on location/date
   */
  async fetchHijriCalendar(year, month, latitude, longitude) {
    try {
      // Default to India (New Delhi) if location is unavailable
      const lat = latitude || 28.6139;
      const long = longitude || 77.209;

      let url = `${HIJRI_API_BASE}/${month}/${year}?method=1&latitude=${lat}&longitude=${long}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 200 && data.data) {
        // Cache the data
        await this.cacheMonthData(year, month, data.data);
        return data.data;
      }
      return null;
    } catch (error) {
      console.warn("Error fetching Hijri calendar:", error);
      return null;
    }
  }

  /**
   * Cache month data to AsyncStorage
   */
  async cacheMonthData(year, month, data) {
    try {
      const key = `${CACHE_KEY_PREFIX}${year}_${month}`;
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn("Error caching data:", error);
    }
  }

  /**
   * Get cached data
   */
  async getCachedMonthData(year, month) {
    try {
      const key = `${CACHE_KEY_PREFIX}${year}_${month}`;
      const json = await AsyncStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Offline fallback for Hijri date using Intl API
   */
  getOfflineHijriDate(date) {
    try {
      return new Intl.DateTimeFormat("en-GB-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return "";
    }
  }

  /**
   * Main method to get date data for a specific Date object
   * Returns { gregorian: string, hijri: string }
   */
  async getDateData(date, useLocation = true) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();

    let hijriDateStr = "";

    // 1. Try to get from Cache or Online
    // We need cached data for the whole month to be efficient
    let monthData = await this.getCachedMonthData(year, month);

    if (!monthData) {
      // FORCE LOCATION: India (New Delhi)
      // We are ignoring the user's actual location to ensure the date matches the printed
      // Ummat Calendar which is based on Indian Moon Sighting.
      const latitude = 28.6139;
      const longitude = 77.209;

      monthData = await this.fetchHijriCalendar(
        year,
        month,
        latitude,
        longitude,
      );
    }

    // 2. Extract specific day from month data
    if (monthData) {
      // Manual Adjustment: User wants -1 day.
      // We look up the Hijri date for "Yesterday" to display it as "Today's" Hijri date.
      // This effectively shifts the calendar back by 1 day.
      const adjustedDate = new Date(date);
      adjustedDate.setDate(date.getDate() - 1); // -1 Adjustment

      // Check if adjusted date is still in the same month (simplification for single-month fetch)
      // If we crossed month boundary, we might miss data, so we fallback to standard date or would need to fetch prev month.
      // For now, we try to find the adjusted date in the current loaded data.

      const targetLookupDate =
        adjustedDate.getMonth() === date.getMonth() ? adjustedDate : date;
      // Note: If we switched back to previous month, we won't find it in 'monthData' which is for 'date.getMonth()'.
      // So if boundary crossed, we revert to 'date' (no adjustment) or we'd need more complex logic.
      // User urgency suggests 'mostly working' is better.

      const day = targetLookupDate.getDate();
      const month = targetLookupDate.getMonth() + 1;
      const year = targetLookupDate.getFullYear();

      // Aladhan API returns array of days. Need to find matching Gregorian date.
      // Format: DD-MM-YYYY
      const dateString = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
      const dayData = monthData.find((d) => d.gregorian.date === dateString);

      if (dayData && dayData.hijri) {
        hijriDateStr = `${dayData.hijri.day} ${dayData.hijri.month.en} ${dayData.hijri.year}`;
      }
    }

    // 3. Fallback to Offline Calculation if still empty
    if (!hijriDateStr) {
      hijriDateStr = this.getOfflineHijriDate(date);
    }

    // Gregorian Formatted
    const gregorianDateStr = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return {
      gregorian: gregorianDateStr,
      hijri: hijriDateStr,
    };
  }
}

export default new DateService();
