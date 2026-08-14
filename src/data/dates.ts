const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const WEEKDAY_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const MONTH_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/** Real “today” used across the app */
export function appHoy(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toDateClave(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDias(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatShortFecha(date: Date): string {
  return `${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
}

export function formatLongFecha(date: Date): string {
  return `${WEEKDAY_LONG[date.getDay()]}, ${MONTH_LONG[date.getMonth()]} ${date.getDate()}`;
}

export function formatMonthAnio(year: number, monthIndice: number): string {
  return `${MONTH_LONG[monthIndice]} ${year}`;
}

export function formatMonthDia(monthIndice: number, day: number): string {
  return `${MONTH_LONG[monthIndice]} ${day}`;
}

export function daysInMes(year: number, monthIndice: number): number {
  return new Date(year, monthIndice + 1, 0).getDate();
}

/** Sunday-first offset matching the calendar weekday row */
export function monthStartDesfase(year: number, monthIndice: number): number {
  return new Date(year, monthIndice, 1).getDay();
}

export function dateKeyFor(year: number, monthIndice: number, day: number): string {
  const month = String(monthIndice + 1).padStart(2, '0');
  const dayPart = String(day).padStart(2, '0');
  return `${year}-${month}-${dayPart}`;
}

export const APP_TODAY_KEY = toDateClave(appHoy());
