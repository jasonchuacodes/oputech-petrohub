import { Stack, Box, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';

import { PageLayout, BackButton, NoData } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { UserRoutes } from '~/routes';
import { useGetReportByIdQuery } from '~/services/report/report.queries';

import { ReportDetail } from './ReportDetail';

export const ReportDetailPage = () => {
  const { auth } = useAuthContext();
  const { reportId } = useParams<{ reportId: string }>();

  const tenantId = auth?.tenantId || null;
  const {
    data: report,
    isLoading,
    isError,
  } = useGetReportByIdQuery({
    tenantId: tenantId!,
    reportId: reportId!,
  });

  if (isLoading) {
    return (
      <PageLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  if (isError || !report) {
    return (
      <PageLayout>
        <Stack spacing={2} p={2} bgcolor="background.paper" flex={1}>
          <BackButton to={UserRoutes.Report} text="Back to Shift Selection" />
          <NoData text="Report not found" />
        </Stack>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Stack spacing={2} p={2} bgcolor="background.paper" flex={1}>
        <BackButton to={UserRoutes.Report} text="Back" />
        <ReportDetail reportId={reportId!} tenantId={tenantId!} shift={report.shift} />
      </Stack>
    </PageLayout>
  );
};
