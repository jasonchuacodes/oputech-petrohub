import { useState } from 'react';
import { Divider, Grid, Stack, Typography } from '@mui/material';

import { PageHeader } from '~/components/layouts';
import { PageContainer, PageLayout, Show } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { DashboardProvider, useDashboardContext } from '~/context/dashboard';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetProductsByTypeQuery } from '~/services/product/product.queries';
import type { Product, ProductType } from '~/services/product/product.types';
import { useGetDisposalAnalyticsDataQuery } from '~/services/analytics/analytics.queries';
import { getDateRangeFromPreset } from '~/utils/date-ranges';

import { EditProductTypePriceModal } from './EditProductTypePriceModal';
import { PresetFilterMenu } from './PresetFilterMenu';
import { ProductPrice } from './ProductPrice';
import { ReportCard } from './ReportCard';
import { TotalDisposals } from './TotalDisposals';
import { TotalExpenses } from './TotalExpenses';
import { TotalIncome } from './TotalIncome';
import { TotalInventorySales } from './TotalInventorySales';
import { TimesheetCard } from './TimesheetCard';

const AnalyticsSection = () => {
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

export const HomePage = () => {
  const { auth } = useAuthContext();
  const { tenantId } = useTenantContext();

  const { data: productsData, isLoading: isLoadingProducts } = useGetProductsByTypeQuery(tenantId);
  const products = productsData ?? [];

  const [editProduct, setEditProduct] = useState<Product | null>(null);

  return (
    <PageLayout>
      <PageContainer maxWidth="xl" spacing={5}>
        <PageHeader
          title={`Welcome back, ${auth?.name || 'Admin'}!`}
          description="Get a comprehensive overview of your company's performance."
        />
        <Stack spacing={1}>
          <DashboardProvider>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              divider={
                <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center' }} />
              }
            >
              <Typography>Filter</Typography>
              <PresetFilterMenu />
            </Stack>
            {/* Analytics */}
            <AnalyticsSection />
          </DashboardProvider>
        </Stack>

        {/* Product Prices */}
        <Show when={!isLoadingProducts && products.length > 0}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Fuel Prices
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View current fuel product prices
              </Typography>
            </Stack>
            <Grid container spacing={2} alignItems="stretch">
              {products &&
                products.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, md: 6, lg: 4 }} display="flex">
                    <ProductPrice product={product} onEdit={setEditProduct} />
                  </Grid>
                ))}
            </Grid>
          </Stack>
        </Show>

        {editProduct && (
          <EditProductTypePriceModal
            open={!!editProduct}
            onClose={() => setEditProduct(null)}
            product={editProduct}
          />
        )}

        {/* Operations */}
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Operations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View daily reports and timesheets.
            </Typography>
          </Stack>
          <Grid container spacing={2} alignItems="stretch">
            <Grid size={{ xs: 12, md: 12, lg: 6 }} display="flex">
              <ReportCard />
            </Grid>
            <Grid size={{ xs: 12, md: 12, lg: 6 }}>
              <TimesheetCard />
            </Grid>
          </Grid>
        </Stack>
      </PageContainer>
    </PageLayout>
  );
};
