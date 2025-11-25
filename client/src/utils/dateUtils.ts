import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const APP_TZ = import.meta.env.VITE_TZ || 'Asia/Manila';

/**
 * format date range. if same day, return single date. else return MM/DD/YY - MM/DD/YY.
 * @param {Dayjs|null} start start date
 * @param {Dayjs|null} end end date
 * @returns {string} formatted range
 */
export const formatRange = (start: Dayjs | null, end: Dayjs | null) => {
  if (start && end && start.isSame(end, 'day')) {
    return start.format('MMMM D, YYYY');
  }

  return `${start ? start.format('MM/DD/YY') : 'MM/DD/YY'} - ${end ? end.format('MM/DD/YY') : 'MM/DD/YY'}`;
};

/**
 * get initial date range from sessionStorage by key.
 * if exist -> parse + return dayjs start/end of day.
 * else -> return current week (sun–sat).
 * @param {string} key storage key
 * @returns {{ startDate: Dayjs, endDate: Dayjs }} date range object
 */
export const getInitialDateRange = (key: string) => {
  const saved = sessionStorage.getItem(key);

  if (saved) {
    const { start, end } = JSON.parse(saved);

    return {
      startDate: dayjs(start).startOf('day'),
      endDate: dayjs(end).endOf('day'),
    };
  }

  return {
    startDate: dayjs().weekday(0).startOf('day'),
    endDate: dayjs().weekday(6).endOf('day'),
  };
};

/**
 * format date using local timezone.
 */
export const formatDate = (date: string | Date, format: string): string => {
  return dayjs(date).tz(APP_TZ).format(format);
};

/**
 * get dayjs instance in local timezone.
 */
export const dayjsLocal = (date?: string | Date): Dayjs => {
  return dayjs(date).tz(APP_TZ);
};
