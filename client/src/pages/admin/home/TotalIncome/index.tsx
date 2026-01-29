import type { AnalyticsData } from '~/services/analytics/analytics.types';
import { useDashboardContext } from '~/context/dashboard';
import { formatCurrency } from '~/utils/number';

import { AnalyticsCard } from '../AnalyticsCard';

const mockIncomeData: AnalyticsData = {
  value: 285000,
  changePercentage: 12.5,
  datapoints: [
    { value: 8500, timestamp: '2026-01-01T00:00:00.000Z' },
    { value: 9200, timestamp: '2026-01-02T00:00:00.000Z' },
    { value: 8800, timestamp: '2026-01-03T00:00:00.000Z' },
    { value: 12000, timestamp: '2026-01-04T00:00:00.000Z' },
    { value: 85000, timestamp: '2026-01-05T00:00:00.000Z' },
    { value: 9500, timestamp: '2026-01-06T00:00:00.000Z' },
    { value: 10200, timestamp: '2026-01-07T00:00:00.000Z' },
    { value: 8900, timestamp: '2026-01-08T00:00:00.000Z' },
    { value: 9800, timestamp: '2026-01-09T00:00:00.000Z' },
    { value: 32000, timestamp: '2026-01-10T00:00:00.000Z' },
    { value: 13200, timestamp: '2026-01-11T00:00:00.000Z' },
    { value: 42000, timestamp: '2026-01-12T00:00:00.000Z' },
    { value: 9400, timestamp: '2026-01-13T00:00:00.000Z' },
    { value: 10100, timestamp: '2026-01-14T00:00:00.000Z' },
    { value: 50000, timestamp: '2026-01-15T00:00:00.000Z' },
    { value: 24000, timestamp: '2026-01-16T00:00:00.000Z' },
    { value: 8700, timestamp: '2026-01-17T00:00:00.000Z' },
    { value: 12500, timestamp: '2026-01-18T00:00:00.000Z' },
    { value: 11900, timestamp: '2026-01-19T00:00:00.000Z' },
    { value: 9300, timestamp: '2026-01-20T00:00:00.000Z' },
    { value: 10500, timestamp: '2026-01-21T00:00:00.000Z' },
    { value: 9100, timestamp: '2026-01-22T00:00:00.000Z' },
    { value: 9700, timestamp: '2026-01-23T00:00:00.000Z' },
    { value: 8400, timestamp: '2026-01-24T00:00:00.000Z' },
  ],
};

export const TotalIncome = () => {
  const { preset } = useDashboardContext();
  // TODO: Use preset with analytics query hook when backend is ready

  return (
    <AnalyticsCard
      title="Total Income"
      value={mockIncomeData.value}
      changePercentage={mockIncomeData.changePercentage}
      datapoints={mockIncomeData.datapoints}
      valueFormatter={formatCurrency}
    />
  );
};
