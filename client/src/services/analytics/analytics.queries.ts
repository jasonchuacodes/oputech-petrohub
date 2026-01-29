import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { getTotalIncomeAnalyticsData } from './analytics.api';
import type { AnalyticsFilters, AnalyticsData } from './analytics.types';

export const useGetTotalIncomeAnalyticsDataQuery = (
  filters: AnalyticsFilters,
): UseQueryResult<AnalyticsData> => {
  return useQuery({
    queryKey: ['analytics', 'income-chart', filters.tenantId, filters.startDate, filters.endDate],
    queryFn: () => getTotalIncomeAnalyticsData(filters),
    enabled: !!filters.tenantId,
  });
};
