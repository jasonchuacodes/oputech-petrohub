import { Container, Grid, Stack, Typography } from '@mui/material';

import { DateTimeDisplay, PageLayout } from '~/components/ui';

import { AttendanceWidget } from './AttendanceWidget';
import { UsersWidget } from './UserWidget';

export const HomePage = () => {
  return (
    <PageLayout p={3}>
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={3}>
          {/* Header */}
          <Stack spacing={0.5}>
            <Typography fontWeight="bold" variant="h5">
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
            <Grid size={{ xs: 12, md: 12, lg: 8 }}>
              <AttendanceWidget />
            </Grid>
            <Grid size={{ xs: 12, md: 12, lg: 4 }}>
              <UsersWidget />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </PageLayout>
  );
};
