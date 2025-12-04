import { Typography, Container, Stack, Divider, Box } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  BackButton,
  Button,
  DateRangePicker,
  LoadingSpinner,
  NoData,
  PageLayout,
  type DateRange,
} from '~/components/ui';
import { pathFor } from '~/utils/pathFor';
import { AdminRoutes } from '~/routes';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { FileDownloadOutlined } from '@mui/icons-material';
import { useGetUserTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import { useGetUserQuery } from '~/services/user/user.queries';
import { getInitialDateRange } from '~/utils/date';

import { TimesheetLogsTable } from '../../timesheets/timesheet-logs/TimesheetLogsTable';
import { UserHeader } from './UserHeader';

const TIMESHEETS_KEY = 'timesheetRange';

export const TimesheetLogsPage = () => {
  const { userId } = useParams();
  const { tenantId } = useTenantContext();

  const initialRange = useMemo(() => getInitialDateRange(TIMESHEETS_KEY), []);

  const [startDate, setStartDate] = useState<Dayjs | null>(initialRange.startDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialRange.endDate);

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

  useEffect(() => {
    if (startDate && endDate) {
      sessionStorage.setItem(
        TIMESHEETS_KEY,
        JSON.stringify({
          start: startDate.utc().toISOString(),
          end: endDate.utc().toISOString(),
        }),
      );
    }
  }, [startDate, endDate]);

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
            <TimesheetLogsTable timesheets={timesheetLogs} />
          ) : (
            <NoData text="No timesheets data available." />
          )}
        </Stack>
      </Container>
    </PageLayout>
  );
};
