import type { AnalyticsFilters, AnalyticsData } from './analytics.types';

export const getTotalIncomeAnalyticsData = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _filters: AnalyticsFilters,
): Promise<AnalyticsData> => {
  // TODO: Replace with real API call when backend ready
  // Example real implementation:
  // const response = await axios.get(`/api/tenants/${filters.tenantId}/analytics/income`, {
  //   params: {
  //     startDate: filters.startDate,
  //     endDate: filters.endDate,
  //   },
  // });
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 300));

  return { value: 285000, changePercentage: 12.5, datapoints: [] };
};
