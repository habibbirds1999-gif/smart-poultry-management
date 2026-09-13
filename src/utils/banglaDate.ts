// Bengali number converter
export const toBengaliNumber = (num: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};

// Bengali Day Names
const banglaDays: { [key: number]: string } = {
  0: 'রবিবার',
  1: 'সোমবার',
  2: 'মঙ্গলবার',
  3: 'বুধবার',
  4: 'বৃহস্পতিবার',
  5: 'শুক্রবার',
  6: 'শনিবার',
};

// Bengali Months
const banglaMonths = [
  'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
  'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
];

/**
 * Approximate calculation of Bangla Date based on Gregorian Date
 * Revised Bengali calendar:
 * Boishakh (Apr 14) to Bhadra (Sep 14) = 31 days each (first 5 months)
 * Ashwin (Sep 15) to Falgun = 30 days each
 * Chaitra = 30 days (31 in leap year)
 */
export function getBanglaDate(date: Date = new Date()): { day: number; month: string; year: number; formatted: string } {
  const d = date.getDate();
  const m = date.getMonth(); // 0-11
  const y = date.getFullYear();

  // Reference for Year 1433 is 2026-2027 (Bengali Year = Gregorian Year - 593 or 594)
  let banglaYear = y - 593;
  if (m < 3 || (m === 3 && d < 14)) {
    banglaYear = y - 594;
  }

  // Month and Day determination
  // April 14 is 1 Boishakh
  let bDay = 1;
  let bMonthIndex = 0;

  // Let's create an exact lookup / math
  // For September 13:
  // Aug 16 - Sep 15 is Bhadra. Sep 13 is 29 Bhadra!
  if (m === 8) { // September
    if (d <= 15) {
      bMonthIndex = 4; // Bhadra
      bDay = d + 16;
    } else {
      bMonthIndex = 5; // Ashwin
      bDay = d - 15;
    }
  } else if (m === 0) { // January
    if (d <= 14) { bMonthIndex = 8; bDay = d + 16; } else { bMonthIndex = 9; bDay = d - 14; }
  } else if (m === 1) { // February
    if (d <= 13) { bMonthIndex = 9; bDay = d + 17; } else { bMonthIndex = 10; bDay = d - 13; }
  } else if (m === 2) { // March
    if (d <= 14) { bMonthIndex = 10; bDay = d + 16; } else { bMonthIndex = 11; bDay = d - 14; }
  } else if (m === 3) { // April
    if (d < 14) { bMonthIndex = 11; bDay = d + 17; } else { bMonthIndex = 0; bDay = d - 13; }
  } else if (m === 4) { // May
    if (d <= 14) { bMonthIndex = 0; bDay = d + 17; } else { bMonthIndex = 1; bDay = d - 14; }
  } else if (m === 5) { // June
    if (d <= 15) { bMonthIndex = 1; bDay = d + 17; } else { bMonthIndex = 2; bDay = d - 15; }
  } else if (m === 6) { // July
    if (d <= 16) { bMonthIndex = 2; bDay = d + 16; } else { bMonthIndex = 3; bDay = d - 16; }
  } else if (m === 7) { // August
    if (d <= 16) { bMonthIndex = 3; bDay = d + 15; } else { bMonthIndex = 4; bDay = d - 16; }
  } else if (m === 9) { // October
    if (d <= 16) { bMonthIndex = 5; bDay = d + 15; } else { bMonthIndex = 6; bDay = d - 16; }
  } else if (m === 10) { // November
    if (d <= 15) { bMonthIndex = 6; bDay = d + 15; } else { bMonthIndex = 7; bDay = d - 15; }
  } else if (m === 11) { // December
    if (d <= 15) { bMonthIndex = 7; bDay = d + 15; } else { bMonthIndex = 8; bDay = d - 15; }
  }

  const banglaMonthName = banglaMonths[bMonthIndex];
  const formatted = `${toBengaliNumber(bDay)} ${banglaMonthName}, ${toBengaliNumber(banglaYear)}`;

  return {
    day: bDay,
    month: banglaMonthName,
    year: banglaYear,
    formatted,
  };
}

export function getFullFormattedHeaderDate(date: Date = new Date(), lang: 'bn' | 'en' = 'en'): string {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  const dayNum = date.getDate();
  const year = date.getFullYear();

  const bnDate = getBanglaDate(date);

  // e.g. "Today, Sunday, September 13, 2026 | ২৯ ভাদ্র, ১৪৩৩"
  if (lang === 'bn') {
    const bnDayName = banglaDays[date.getDay()];
    return `আজ, ${bnDayName}, ${toBengaliNumber(dayNum)} ${monthName} ${toBengaliNumber(year)} | ${bnDate.formatted}`;
  }

  return `Today, ${dayName}, ${monthName} ${dayNum}, ${year} | ${bnDate.formatted}`;
}
