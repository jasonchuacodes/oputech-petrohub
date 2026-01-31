import { useDashboardContext } from '~/context/dashboard';
import type { AnalyticsData } from '~/services/analytics/analytics.types';
import theme from '~/theme';
import { formatCurrency, formatNumber } from '~/utils/number';

import { AnalyticsCard } from '../AnalyticsCard';

const mockDisposalsData: AnalyticsData = {
  value: 57495,
  changePercentage: -3.2,
  datapoints: [
    { value: 2140, timestamp: '2026-01-01T00:00:00.000Z' },
    { value: 2870, timestamp: '2026-01-02T00:00:00.000Z' },
    { value: 1560, timestamp: '2026-01-03T00:00:00.000Z' },
    { value: 2980, timestamp: '2026-01-04T00:00:00.000Z' },
    { value: 1210, timestamp: '2026-01-05T00:00:00.000Z' },
    { value: 2430, timestamp: '2026-01-06T00:00:00.000Z' },
    { value: 1890, timestamp: '2026-01-07T00:00:00.000Z' },
    { value: 2710, timestamp: '2026-01-08T00:00:00.000Z' },
    { value: 1640, timestamp: '2026-01-09T00:00:00.000Z' },
    { value: 2950, timestamp: '2026-01-10T00:00:00.000Z' },
    { value: 2320, timestamp: '2026-01-11T00:00:00.000Z' },
    { value: 1780, timestamp: '2026-01-12T00:00:00.000Z' },
    { value: 2600, timestamp: '2026-01-13T00:00:00.000Z' },
    { value: 1470, timestamp: '2026-01-14T00:00:00.000Z' },
    { value: 1990, timestamp: '2026-01-15T00:00:00.000Z' },
    { value: 2840, timestamp: '2026-01-16T00:00:00.000Z' },
    { value: 1710, timestamp: '2026-01-17T00:00:00.000Z' },
    { value: 2660, timestamp: '2026-01-18T00:00:00.000Z' },
    { value: 2130, timestamp: '2026-01-19T00:00:00.000Z' },
    { value: 1580, timestamp: '2026-01-20T00:00:00.000Z' },
    { value: 2910, timestamp: '2026-01-21T00:00:00.000Z' },
    { value: 1340, timestamp: '2026-01-22T00:00:00.000Z' },
    { value: 2480, timestamp: '2026-01-23T00:00:00.000Z' },
    { value: 1760, timestamp: '2026-01-24T00:00:00.000Z' },
  ],
};

export function TotalDisposals({ title }: { title: string }) {
  const { preset } = useDashboardContext();
  // TODO: Use preset with analytics query hook when backend is ready

  return (
    <AnalyticsCard
      title={title}
      value={mockDisposalsData.value}
      changePercentage={mockDisposalsData.changePercentage}
      datapoints={mockDisposalsData.datapoints}
      valueFormatter={(value) => formatNumber(value, 3)}
      color={theme.palette.warning.main}
      graph={false}
    />
  );
}
