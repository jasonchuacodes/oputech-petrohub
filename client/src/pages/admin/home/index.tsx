import { Divider, Grid, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { PageHeader } from '~/components/layouts';
import { Button, PageContainer, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { DashboardProvider } from '~/context/dashboard';

import { AnalyticsSection } from './AnalyticsSection';
import { PresetFilterMenu } from './PresetFilterMenu';
import { ProductPricesSection } from './ProductPricesSection';
import { RebuildConfirmModal } from './RebuildConfirmModal';
import { ReportCard } from './ReportCard';
import { TimesheetCard } from './TimesheetCard';
import { RefreshOutlined } from '@mui/icons-material';

export const HomePage = () => {
  const { auth } = useAuthContext();
  const [rebuildModalOpen, setRebuildModalOpen] = useState(false);

  return (
    <PageLayout>
      <PageContainer maxWidth="xl" spacing={5}>
        <PageHeader
          title={`Welcome back, ${auth?.name || 'Admin'}!`}
          description="Get a comprehensive overview of your company's performance."
        />
        <Stack spacing={1}>
          <DashboardProvider>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ height: 20, alignSelf: 'center' }}
                  />
                }
              >
                <Typography>Filter</Typography>
                <PresetFilterMenu />
              </Stack>
              <Button
                onClick={() => setRebuildModalOpen(true)}
                endIcon={<RefreshOutlined fontSize="small" />}
              >
                Rebuild
              </Button>
            </Stack>
            {/* Analytics */}
            <AnalyticsSection />
          </DashboardProvider>
        </Stack>

        <RebuildConfirmModal
          open={rebuildModalOpen}
          onClose={() => setRebuildModalOpen(false)}
        />

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
