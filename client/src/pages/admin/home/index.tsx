import { Grid, Stack, Typography } from '@mui/material';

import { DateTimeDisplay, PageContainer, PageLayout } from '~/components/ui';

import { TimesheetWidget } from './TimesheetWidget';
import { UsersWidget } from './UserWidget';

export const HomePage = () => {
  return (
    <PageLayout>
      <PageContainer>
        {/* Header */}
        <Stack spacing={0.5}>
            <Typography variant="h6">
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get a comprehensive overview of your company&apos;s performance.
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 12, lg: 12 }}>
              <DateTimeDisplay />
            </Grid>
            <Grid size= {{ xs: 12, md: 12, lg: 12 }}>
              <TimesheetWidget />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 6 }}>
              <UsersWidget/>
            </Grid>
          </Grid>
      </PageContainer>
    </PageLayout>
  );
};
