import { FileDownloadOutlined } from '@mui/icons-material';
import { Box, Container, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { SearchInput } from '~/components/form';
import {
  Button,
  DateRangePicker,
  LoadingSpinner,
  NoData,
  PageLayout,
  type DateRange,
} from '~/components/ui';
import { TimesheetProvider } from '~/context/timesheet/TimesheetContext';
import { useTimesheetContext } from '~/context/timesheet/useTimesheetContext';
import { useGetAllTimesheetsQuery } from '~/services/timesheet/timesheet.queries';

import { TimesheetTable } from './TimesheetTable';
import { TimesheetLogs } from './timesheet-logs';

dayjs.extend(weekday);
dayjs.extend(utc);

const TimesheetsPageContent = () => {
  const { tenantId, userId } = useParams();
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    searchTerm,
    setSearchTerm,
  } = useTimesheetContext();

  const { data: timesheets, isLoading } = useGetAllTimesheetsQuery({
    tenantId,
    startDate,
    endDate,
  });

  const filteredTimesheets = timesheets?.filter((timesheet) =>
    timesheet.user.name.toLocaleLowerCase().startsWith(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    if (userId) {
      setSearchTerm('');
    }
  }, [userId, setSearchTerm]);

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

  const handleExport = () => alert('This feature is pending.');

  return (
    <PageLayout p={3}>
      {userId ? (
        <TimesheetLogs />
      ) : (
        <Container maxWidth="lg" disableGutters>
          <Stack spacing={2}>
            {/* Header */}
            <Stack spacing={3} alignItems="start">
              <Stack spacing={0.5}>
                <Typography variant="h6">
                  Timesheets
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage timesheet records for your team
                </Typography>
              </Stack>
              <DateRangePicker
                selectedStart={startDate}
                selectedEnd={endDate}
                label="Select Time Period"
                onAccept={handleSelectDateRange}
              />
            </Stack>
            <Stack direction="row" alignItems="end" justifyContent="space-between">
              <SearchInput
                placeholder="Search employee"
                value={searchTerm}
                onChange={setSearchTerm}
              />
              <Button
                startIcon={<FileDownloadOutlined />}
                onClick={handleExport}
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
            ) : filteredTimesheets && filteredTimesheets.length > 0 ? (
              <TimesheetTable timesheets={filteredTimesheets} />
            ) : (
              <NoData text="No timesheets data available." />
            )}
          </Stack>
        </Container>
      )}
    </PageLayout>
  );
};

export const TimesheetsPage = () => (
  <TimesheetProvider>
    <TimesheetsPageContent />
  </TimesheetProvider>
);
