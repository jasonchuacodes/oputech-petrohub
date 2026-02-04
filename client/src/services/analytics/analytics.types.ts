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

export type DisposalAnalyticsDataByType = {
  productType: 'GASOLINE' | 'PREMIUM' | 'DIESEL' | 'KEROSENE';
  value: number;
  changePercentage: number;
};
