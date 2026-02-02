import { Divider, Grid, Stack, Typography } from '@mui/material';

import { PageHeader } from '~/components/layouts';
import { PageContainer, PageLayout, Show } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { DashboardProvider } from '~/context/dashboard';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetProductsQuery } from '~/services/product/product.queries';
import { ProductCategory } from '~/services/product/product.types';

import { PresetFilterMenu } from './PresetFilterMenu';
import { TotalDisposals } from './TotalDisposals';
import { TotalExpenses } from './TotalExpenses';
import { TotalIncome } from './TotalIncome';
import { TimesheetWidget } from './TimesheetWidget';
import { ProductPrice } from './ProductPrice';

export const HomePage = () => {
  const { auth } = useAuthContext();
  const { tenantId } = useTenantContext();

  const { data: products, isLoading: isLoadingProducts } = useGetProductsQuery(
    tenantId,
    ProductCategory.FUEL,
  );

  return (
    <PageLayout>
      <PageContainer maxWidth="xl">
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
            <Grid container spacing={2} alignItems="stretch">
              <Grid size={{ xs: 12, md: 6, lg: 6 }} display="flex">
                <Stack width="100%">
                  <TotalIncome />
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 6 }} display="flex">
                <Stack width="100%">
                  <TotalExpenses />
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <TotalDisposals title="XCS Disposals" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                <TotalDisposals title="XTRA Disposals" />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                <TotalDisposals title="ADO Disposals" />
              </Grid>
            </Grid>
          </DashboardProvider>
        </Stack>

        {/* Product Prices */}
        <Show when={!isLoadingProducts}>
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Fuel Prices
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View current fuel product prices
            </Typography>
          </Stack>

          <Grid container spacing={2} alignItems="stretch">
            {products &&
              products.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }} display="flex">
                  <Stack width="100%">
                    <ProductPrice product={product} />
                  </Stack>
                </Grid>
              ))}
          </Grid>
        </Show>

        {/* Operations */}
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Operations
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get a comprehensive overview of your company’s performance.
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
              <TimesheetWidget />
            </Grid>
          </Grid>
        </Stack>
      </PageContainer>
    </PageLayout>
  );
};
