import { startOfMonth, endOfMonth } from 'date-fns';

export type AnalyticsPreset = 'monthly';

export const getDateRangeFromPreset = (preset: AnalyticsPreset) => {
  const now = new Date();

  switch (preset) {
    case 'monthly':
      return {
        startDate: startOfMonth(now).toISOString(),
        endDate: endOfMonth(now).toISOString(),
      };
    default:
      return {
        startDate: startOfMonth(now).toISOString(),
        endDate: endOfMonth(now).toISOString(),
      };
  }
};
