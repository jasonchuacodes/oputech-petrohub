import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const APP_TZ = process.env.TZ || 'Asia/Manila';

/**
 * Get start of local day as a UTC Date
 */
export const getStartOfDay = (date: Date = new Date()): Date => {
  const local = toZonedTime(date, APP_TZ);
  local.setHours(0, 0, 0, 0);
  const result = fromZonedTime(local, APP_TZ);
  
  return result;
};

/**
 * Get end of local day as a UTC Date
 */
export const getEndOfDay = (date: Date = new Date()): Date => {
  const local = toZonedTime(date, APP_TZ);
  local.setHours(23, 59, 59, 999);
  return fromZonedTime(local, APP_TZ);
};

/**
 * Apply time from source DateTime to target date
 * Used for shift schedule comparisons (stored as 1970 base, apply to today)
 */
export const applyTimeToDate = (sourceTime: Date, targetDate: Date = new Date()): Date => {
  const sourceLocal = toZonedTime(sourceTime, APP_TZ);
  const targetLocal = toZonedTime(targetDate, APP_TZ);

  targetLocal.setHours(sourceLocal.getHours(), sourceLocal.getMinutes(), 0, 0);

  return fromZonedTime(targetLocal, APP_TZ);
};
