import axios from '~/lib/axiosInstance';
import type { AnalyticsFilters, AnalyticsData, DisposalAnalyticsDataByType } from './analytics.types';

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
    }
  );
  return response.data.data;
};

export const getTotalExpenseAnalyticsData = async (
  filters: AnalyticsFilters,
): Promise<AnalyticsData> => {
  const response = await axios.get(
    '/analytics/expenses',
    {
      params: {
        tenantId: filters.tenantId,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    }
  );
  return response.data.data;
};

export const getDisposalAnalyticsData = async (
  filters: AnalyticsFilters,
): Promise<DisposalAnalyticsDataByType[]> => {
  const response = await axios.get(
    '/analytics/disposals',
    {
      params: {
        tenantId: filters.tenantId,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    }
  );
  return response.data.data;
};
