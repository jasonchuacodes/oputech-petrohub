import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getTotalIncomeAnalyticsData, getTotalExpenseAnalyticsData, getDisposalAnalyticsData } from './analytics.api';
import type { AnalyticsFilters, AnalyticsData, DisposalAnalyticsDataByType } from './analytics.types';

export const useGetTotalIncomeAnalyticsDataQuery = (
  filters: AnalyticsFilters,
): UseQueryResult<AnalyticsData> => {
  return useQuery({
    queryKey: ['analytics', 'income-chart', filters.tenantId, filters.startDate, filters.endDate],
    queryFn: () => getTotalIncomeAnalyticsData(filters),
    enabled: !!filters.tenantId,
  });
};

export const useGetTotalExpenseAnalyticsDataQuery = (
  filters: AnalyticsFilters,
): UseQueryResult<AnalyticsData> => {
  return useQuery({
    queryKey: ['analytics', 'expense-chart', filters.tenantId, filters.startDate, filters.endDate],
    queryFn: () => getTotalExpenseAnalyticsData(filters),
    enabled: !!filters.tenantId,
  });
};

export const useGetDisposalAnalyticsDataQuery = (
  filters: AnalyticsFilters,
): UseQueryResult<DisposalAnalyticsDataByType[]> => {
  return useQuery({
    queryKey: ['analytics', 'disposal-chart', filters.tenantId, filters.startDate, filters.endDate],
    queryFn: () => getDisposalAnalyticsData(filters),
    enabled: !!filters.tenantId,
  });
};
