import type { AnalyticsData } from '~/services/analytics/analytics.types';
import theme from '~/theme';
import { formatCurrency } from '~/utils/number';

import { AnalyticsCard } from '../AnalyticsCard';

const mockExpensesData: AnalyticsData = {
  value: 138000,
  changePercentage: -3.2,
  datapoints: [
    { value: 3500, timestamp: '2026-01-01T00:00:00.000Z' },
    { value: 4200, timestamp: '2026-01-02T00:00:00.000Z' },
    { value: 3800, timestamp: '2026-01-03T00:00:00.000Z' },
    { value: 20000, timestamp: '2026-01-04T00:00:00.000Z' }, // Spike: Payroll
    { value: 2500, timestamp: '2026-01-05T00:00:00.000Z' },
    { value: 4500, timestamp: '2026-01-06T00:00:00.000Z' },
    { value: 3900, timestamp: '2026-01-07T00:00:00.000Z' },
    { value: 4100, timestamp: '2026-01-08T00:00:00.000Z' },
    { value: 3700, timestamp: '2026-01-09T00:00:00.000Z' },
    { value: 5800, timestamp: '2026-01-10T00:00:00.000Z' },
    { value: 4300, timestamp: '2026-01-11T00:00:00.000Z' },
    { value: 22000, timestamp: '2026-01-12T00:00:00.000Z' }, // Spike: Rent/utilities
    { value: 3600, timestamp: '2026-01-13T00:00:00.000Z' },
    { value: 4000, timestamp: '2026-01-14T00:00:00.000Z' },
    { value: 1800, timestamp: '2026-01-15T00:00:00.000Z' },
    { value: 4400, timestamp: '2026-01-16T00:00:00.000Z' },
    { value: 3900, timestamp: '2026-01-17T00:00:00.000Z' },
    { value: 18500, timestamp: '2026-01-18T00:00:00.000Z' }, // Spike: Inventory
    { value: 4100, timestamp: '2026-01-19T00:00:00.000Z' },
    { value: 3800, timestamp: '2026-01-20T00:00:00.000Z' },
    { value: 6200, timestamp: '2026-01-21T00:00:00.000Z' },
    { value: 2200, timestamp: '2026-01-22T00:00:00.000Z' },
    { value: 4000, timestamp: '2026-01-23T00:00:00.000Z' },
    { value: 3600, timestamp: '2026-01-24T00:00:00.000Z' },
  ],
};

export function TotalExpenses() {
  return (
    <AnalyticsCard
      title="Total Expenses"
      value={mockExpensesData.value}
      changePercentage={mockExpensesData.changePercentage}
      datapoints={mockExpensesData.datapoints}
      valueFormatter={formatCurrency}
      color={theme.palette.warning.main}
    />
  );
}
