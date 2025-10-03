import { FileDownloadOutlined } from '@mui/icons-material';
import { Box, Container, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import { useEffect, useMemo, useState } from 'react';
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
import { useGetAllTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import { getInitialDateRange } from '~/utils/dateUtils';

import { TimesheetTable } from './TimesheetTable';

dayjs.extend(weekday);
dayjs.extend(utc);

const TIMESHEETS_KEY = 'timesheetRange';

export const TimesheetsPage = () => {
  const { tenantId } = useParams();
  const initialRange = useMemo(() => getInitialDateRange(TIMESHEETS_KEY), []);

  const [startDate, setStartDate] = useState<Dayjs | null>(initialRange.startDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialRange.endDate);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: timesheets, isLoading } = useGetAllTimesheetsQuery({
    tenantId,
    startDate,
    endDate,
  });

  const filteredTimesheets = timesheets?.filter((timesheet) =>
    timesheet.user.name.toLocaleLowerCase().startsWith(searchTerm.toLowerCase()),
  );

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
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={2}>
          {/* Header */}
          <Stack spacing={3} alignItems="start">
            <Typography fontWeight="bold" variant="h5">
              Timesheets
            </Typography>
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
    </PageLayout>
  );
};
