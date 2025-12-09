import { FileDownloadOutlined } from '@mui/icons-material';
import {
  Box,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import {
  BackButton,
  Button,
  DateRangePicker,
  LoadingSpinner,
  NoData,
  Paper,
  type DateRange,
} from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useTimesheetContext } from '~/context/timesheet/useTimesheetContext';
import { TimesheetLogProvider } from '~/context/timesheetLog';
import { AdminRoutes } from '~/routes';
import { useGetUserQuery } from '~/services/user/user.queries';
import { useGetUserTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import { pathFor } from '~/utils/pathFor';

import { UserHeader } from './UserHeader';
import { TimesheetRow } from './TimesheetRow';

export const TimesheetLogs = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();
  const { startDate, endDate, setStartDate, setEndDate } = useTimesheetContext();

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery({
    userId,
  });

  const { data: timesheetLogs, isLoading } = useGetUserTimesheetsQuery({
    tenantId,
    userId,
    startDate,
    endDate,
  });

  const handleSelectDateRange = ({ start, end }: DateRange) => {
    const newStart = start?.startOf('day') ?? null;
    const newEnd = end?.endOf('day') ?? null;

    const hasChanged =
      (newStart && !newStart.isSame(startDate)) || (newEnd && !newEnd.isSame(endDate));

    if (hasChanged) {
      setStartDate(newStart);
      setEndDate(newEnd);
    }
  };

  const handleGoBack = () => {
    navigate(
      pathFor({
        pathname: AdminRoutes.TenantTimesheets,
        params: { tenantId },
      }),
    );
  };

  if (!userId) {
    return null;
  }

  return (
    <Container maxWidth="md" disableGutters>
      <Stack spacing={3} justifyContent="start" alignItems="stretch">
        <BackButton
          text="Go back"
          onClick={handleGoBack}
          to={pathFor({
            pathname: AdminRoutes.TenantTimesheets,
            params: { tenantId },
          })}
        />

        <Typography variant="h6" fontWeight="bold">
          Timesheet Logs
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <UserHeader user={user} isLoading={isLoadingUser} />
        </Stack>

        <Divider />

        <Stack direction="row" alignItems="end" justifyContent="space-between">
          <DateRangePicker
            onAccept={handleSelectDateRange}
            selectedStart={startDate}
            selectedEnd={endDate}
          />
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
          <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ maxWidth: 240 }}>Date</TableCell>
                  <TableCell align="left">Check In</TableCell>
                  <TableCell align="left">Check Out</TableCell>
                  <TableCell align="left" sx={{ width: 256 }}>
                    Total Hours
                  </TableCell>
                  <TableCell align="left" sx={{ width: 120 }}>
                    Actions
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {timesheetLogs.map((timesheet) => (
                  <TimesheetLogProvider key={timesheet.id} timesheetLog={timesheet}>
                    <TimesheetRow />
                  </TimesheetLogProvider>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <NoData text="No timesheets data available." />
        )}
      </Stack>
    </Container>
  );
};
