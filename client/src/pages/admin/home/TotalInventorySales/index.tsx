import { useDashboardContext } from '~/context/dashboard';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetTotalInventorySalesAnalyticsDataQuery } from '~/services/analytics/analytics.queries';
import { getDateRangeFromPreset } from '~/utils/date-ranges';
import { formatCurrency } from '~/utils/number';

import { AnalyticsCard } from '../AnalyticsCard';

export const TotalInventorySales = () => {
  const { preset } = useDashboardContext();
  const { tenant } = useTenantContext();

  const { startDate, endDate } = getDateRangeFromPreset(preset);

  const { data, isLoading } = useGetTotalInventorySalesAnalyticsDataQuery({
    tenantId: tenant?.id || '',
    startDate,
    endDate,
  });

  return (
    <AnalyticsCard
      title="Total Inventory Sales"
      value={data?.value ?? 0}
      changePercentage={data?.changePercentage ?? 0}
      datapoints={data?.datapoints ?? []}
      valueFormatter={formatCurrency}
      loading={isLoading}
    />
  );
};
