
import { Grid, Stack } from '@mui/material';

import { useDashboardContext } from '~/context/dashboard';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import type { ProductType } from '~/services/product/product.types';
import { useGetDisposalAnalyticsDataQuery } from '~/services/analytics/analytics.queries';
import { getDateRangeFromPreset } from '~/utils/date-ranges';

import { TotalIncome } from './TotalIncome';
import { TotalExpenses } from './TotalExpenses';
import { TotalInventorySales } from './TotalInventorySales';
import { TotalDisposals } from './TotalDisposals';

export const AnalyticsSection = () => {
  const { preset } = useDashboardContext();
  const { tenant } = useTenantContext();

  const { startDate, endDate } = getDateRangeFromPreset(preset);

  const { data: disposalData, isLoading: isLoadingDisposals } = useGetDisposalAnalyticsDataQuery({
    tenantId: tenant?.id || '',
    startDate,
    endDate,
  });

  const productTypeDisplayNames: Record<ProductType, string> = {
    GASOLINE: 'XTRA Disposals',
    PREMIUM: 'XCS Disposals',
    DIESEL: 'ADO Disposals',
    KEROSENE: 'KERO Disposals',
  };

  return (
    <Stack spacing={2}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6, lg: 4 }} display="flex">
          <Stack width="100%">
            <TotalIncome />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }} display="flex">
          <Stack width="100%">
            <TotalExpenses />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 4 }} display="flex">
          <Stack width="100%">
            <TotalInventorySales />
          </Stack>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="stretch">
        {disposalData &&
          disposalData.map((disposal) => (
            <Grid key={disposal.productType} size={{ xs: 12, md: 6, lg: 4 }} display="flex">
              <TotalDisposals
                title={
                  productTypeDisplayNames[disposal.productType] ||
                  `${disposal.productType} Disposals`
                }
                value={disposal.value}
                changePercentage={disposal.changePercentage}
                isLoading={isLoadingDisposals}
              />
            </Grid>
          ))}
      </Grid>
    </Stack>
  );
};