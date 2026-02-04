import axios from '~/lib/axiosInstance';
import type { AnalyticsFilters, AnalyticsData } from './analytics.types';

export const getTotalIncomeAnalyticsData = async (
  filters: AnalyticsFilters,
): Promise<AnalyticsData> => {
  const response = await axios.get(
    '/analytics/income',
    {
      params: {
        tenantId: filters.tenantId,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
      withCredentials: true,
    }
  );
  return response.data.data;
};
