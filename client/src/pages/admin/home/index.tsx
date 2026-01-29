import { Divider, Grid, Stack, Typography } from '@mui/material';

import { PageHeader } from '~/components/layouts';
import { PageContainer, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';

import { TotalIncome } from './TotalIncome';
import { TotalExpenses } from './TotalExpenses';
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
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Typography>Filter</Typography>
          <Typography color="text.secondary">Today</Typography>
          {/* TODO:
            feat: Add menu dropdown for presets - Month, Week, Day

            refer to the implementation of MoreDetailsMenu - but instead of iconbutton, display a button with endIcon chevronRight:rotate90deg on selecting a preset.
            
            wrap the analytics section with context provider for the DashboardContext.
            use the preset value: monthly, weekly, daily to filter the data shown in the analytics cards.
            for now, just default it to daily to show the mock data points (which are daily data points).
            but this [preset] will be used later to pass to the analytics query hooks.
            
            */}
        </Stack>
        {/* Analytics */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <TotalIncome />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <TotalExpenses />
          </Grid>
        </Grid>

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
