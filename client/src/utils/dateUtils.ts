import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

export const formatRange = (start: Dayjs | null, end: Dayjs | null) => {
  if (start && end && start.isSame(end, 'day')) {
    return start.format('MMMM D, YYYY');
  }

  return `${start ? start.format('MM/DD/YY') : 'MM/DD/YY'} - ${end ? end.format('MM/DD/YY') : 'MM/DD/YY'}`;
};

export const getInitialRange = (key: string) => {
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
