import { Grid } from '@mui/material';

import { PageHeader } from '~/components/layouts';
import { PageContainer, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';

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
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <TotalIncome />
          </Grid>
          <Grid size={{ xs: 12, md: 12, lg: 12 }}>
            <TimesheetWidget />
          </Grid>
        </Grid>
      </PageContainer>
    </PageLayout>
  );
};
