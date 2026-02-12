// Small calendar utility module to help with week/day rendering

const MS_IN_DAY = 24 * 60 * 60 * 1000;

// Today is fixed so "current week" is Feb 9 – 14, 2026
export const FIXED_TODAY = new Date('2026-02-11T00:00:00');

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Returns Monday of the week containing the given date
export function getWeekStart(date) {
  const d = startOfDay(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = (day + 6) % 7; // 0 if Monday, 1 if Tuesday, ...
  return new Date(d.getTime() - diffToMonday * MS_IN_DAY);
}

export function getWeekDays(weekStart, count = 6) {
  const start = startOfDay(weekStart);
  return Array.from({ length: count }, (_, idx) => {
    return new Date(start.getTime() + idx * MS_IN_DAY);
  });
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatHeaderToday(date) {
  const d = date;
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'long' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatWeekRangeLabel(weekStart, weekEnd) {
  const startMonthShort = SHORT_MONTHS[weekStart.getMonth()];
  const endMonthShort = SHORT_MONTHS[weekEnd.getMonth()];
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const year = weekEnd.getFullYear();

  if (startMonthShort === endMonthShort) {
    return `${startMonthShort} ${startDay} – ${endDay}, ${year}`;
  }

  return `${startMonthShort} ${startDay} – ${endMonthShort} ${endDay}, ${year}`;
}

export function formatDayHeader(date) {
  const weekday = WEEKDAY_NAMES[date.getDay()];
  const monthShort = SHORT_MONTHS[date.getMonth()];
  const day = date.getDate();
  return {
    weekday,
    label: `${weekday}, ${monthShort} ${day}`,
  };
}

export function parseISOToDate(isoString) {
  return new Date(isoString);
}

