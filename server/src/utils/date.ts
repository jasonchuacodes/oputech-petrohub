import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const APP_TZ = process.env.TZ || 'Asia/Manila';

/**
 * Get start of local day as a UTC Date
 */
export const getStartOfDay = (date: Date = new Date()): Date => {
  const local = toZonedTime(date, APP_TZ);
  local.setHours(0, 0, 0, 0);
  return fromZonedTime(local, APP_TZ);
};

/**
 * Get end of local day as a UTC Date
 */
export const getEndOfDay = (date: Date = new Date()): Date => {
  const local = toZonedTime(date, APP_TZ);
  local.setHours(23, 59, 59, 999);
  return fromZonedTime(local, APP_TZ);
};
