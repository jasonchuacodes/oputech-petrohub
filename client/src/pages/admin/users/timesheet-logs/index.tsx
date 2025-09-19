import { Typography, Container, Stack, Divider, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import {
  BackButton,
  Button,
  DateRangePicker,
  LoadingSpinner,
  NoData,
  PageLayout,
} from '~/components/ui';
import { pathFor } from '~/utils/pathFor';
import { AdminRoutes } from '~/routes';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { FileDownloadOutlined } from '@mui/icons-material';
import { useGetUserTimesheetsQuery } from '~/services/timesheet/timesheet.queries';

import { TimesheetLogsTable } from './TimesheetLogsTable';
import { UserHeader } from './UserHeader';

export const TimesheetLogsPage = () => {
  const { userId } = useParams();
  const { tenantId } = useTenantContext();

  const { data: timesheetLogs, isLoading } = useGetUserTimesheetsQuery({
    tenantId,
    userId,
  });

  return (
    <PageLayout p={3}>
      <Container maxWidth="md" disableGutters>
        <Stack spacing={3} justifyContent="start" alignItems="stretch">
          <BackButton
            text="Go back"
            to={pathFor({
              pathname: AdminRoutes.TenantTimesheets,
              params: { tenantId },
            })}
          />

          <Typography variant="h6" fontWeight="bold">
            Timesheet Logs
          </Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <UserHeader user={timesheetLogs?.[0]?.user} isLoading={isLoading} />
          </Stack>

          <Divider />

          <Stack direction="row" alignItems="end" justifyContent="space-between">
            <DateRangePicker onAccept={() => null} selectedEnd={null} selectedStart={null} />
            <Button
              startIcon={<FileDownloadOutlined />}
              onClick={() => null}
              variant="contained"
              sx={{ height: 40, flexShrink: 0 }}
            >
              Export
            </Button>
          </Stack>

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" pt={10}>
              <LoadingSpinner />
            </Box>
          ) : timesheetLogs && timesheetLogs.length > 0 ? (
            <TimesheetLogsTable timesheets={timesheetLogs} />
          ) : (
            <NoData text="No timesheets data available." />
          )}
        </Stack>
      </Container>
    </PageLayout>
  );
};
