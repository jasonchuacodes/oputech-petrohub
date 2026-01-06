import { Grid } from '@mui/material';

import { PageHeader } from '~/components/layouts';
import { DateTimeDisplay, PageContainer, PageLayout } from '~/components/ui';

import { TimesheetWidget } from './TimesheetWidget';
import { UsersWidget } from './UserWidget';

export const HomePage = () => {
  return (
    <PageLayout>
      <PageContainer>
        {/* Header */}
        <PageHeader
          title="Dashboard"
          description="Get a comprehensive overview of your company's performance."
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <DateTimeDisplay />
          </Grid>
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <TimesheetWidget />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <UsersWidget />
          </Grid>
        </Grid>
      </PageContainer>
    </PageLayout>
  );
};
