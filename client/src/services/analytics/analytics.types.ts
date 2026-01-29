export type AnalyticsDataPoint = {
  value: number;
  timestamp: string;
};

export type AnalyticsData = {
  value: number;
  changePercentage: number;
  datapoints: AnalyticsDataPoint[];
};

export type AnalyticsFilters = {
  tenantId: string;
  startDate?: string;
  endDate?: string;
};
