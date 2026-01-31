import { Divider, Grid, Stack, Typography } from '@mui/material';

import { PageHeader } from '~/components/layouts';
import { PageContainer, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { DashboardProvider } from '~/context/dashboard';

import { PresetFilterMenu } from './PresetFilterMenu';
import { TotalDisposals } from './TotalDisposals';
import { TotalExpenses } from './TotalExpenses';
import { TotalIncome } from './TotalIncome';
import { TimesheetWidget } from './TimesheetWidget';

export const HomePage = () => {
  const { auth } = useAuthContext();

  return (
    <PageLayout>
      <PageContainer>
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
              <Grid size={{ xs: 12, md: 6, lg: 4 }} display="flex">
                <TotalIncome />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }} display="flex">
                <TotalExpenses />
              </Grid>
              <Grid size={{ xs: 12, md: 6, lg: 4 }} >
                <Stack spacing={1}>
                  <TotalDisposals title="XCS Disposals" />
                  <TotalDisposals title="XTRA Disposals" />
                  <TotalDisposals title="ADO Disposals" />
                </Stack>
              </Grid>
            </Grid>
          </DashboardProvider>
        </Stack>

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
