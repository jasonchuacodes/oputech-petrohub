import { Divider, Grid, Stack, Typography } from '@mui/material';

import { PageHeader } from '~/components/layouts';
import { PageContainer, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { DashboardProvider } from '~/context/dashboard';

import { AnalyticsSection } from './AnalyticsSection';
import { PresetFilterMenu } from './PresetFilterMenu';
import { ProductPricesSection } from './ProductPricesSection';
import { ReportCard } from './ReportCard';
import { TimesheetCard } from './TimesheetCard';

export const HomePage = () => {
  const { auth } = useAuthContext();

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
        <ProductPricesSection />

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
