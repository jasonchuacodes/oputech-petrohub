import { useDashboardContext } from '~/context/dashboard';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetTotalExpenseAnalyticsDataQuery } from '~/services/analytics/analytics.queries';
import { getDateRangeFromPreset } from '~/utils/date-ranges';
import theme from '~/theme';
import { formatCurrency } from '~/utils/number';

import { AnalyticsCard } from '../AnalyticsCard';

export const TotalExpenses = () => {
  const { preset } = useDashboardContext();
  const { tenant } = useTenantContext();

  const { startDate, endDate } = getDateRangeFromPreset(preset);

  const { data, isLoading } = useGetTotalExpenseAnalyticsDataQuery({
    tenantId: tenant?.id || '',
    startDate,
    endDate,
  });

  return (
    <AnalyticsCard
      title="Total Expenses"
      value={data?.value ?? 0}
      changePercentage={data?.changePercentage ?? 0}
      datapoints={data?.datapoints ?? []}
      valueFormatter={formatCurrency}
      color={theme.palette.warning.main}
      loading={isLoading}
    />
  );
};
