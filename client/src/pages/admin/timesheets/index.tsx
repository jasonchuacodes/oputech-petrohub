import { Box, Container, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';

import { SearchInput } from '~/components/form';
import {
  Button,
  DateRangePicker,
  LoadingSpinner,
  PageLayout,
  type DateRange,
} from '~/components/ui';
import { useGetAllTimesheetsQuery } from '~/services/timesheet/timesheet.queries';

import { TimesheetTable } from './TimesheetTable';

dayjs.extend(weekday);
dayjs.extend(utc);

export const TimesheetsPage = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().weekday(0).startOf('day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().weekday(6).endOf('day'));

  const { data: timesheets, isLoading } = useGetAllTimesheetsQuery({ startDate, endDate });

  const handleSelectDateRange = ({ start, end }: DateRange) => {
    const newStart = start ? start.startOf('day') : null;
    const newEnd = end ? end.endOf('day') : null;

    const hasChanged =
      (newStart && !newStart.isSame(startDate)) || (newEnd && !newEnd.isSame(endDate));

    if (hasChanged) {
      setStartDate(newStart);
      setEndDate(newEnd);
    }
  };

  const handleExport = () => alert('This is feature is pending.');

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

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" pt={10}>
              <LoadingSpinner />
            </Box>
          ) : (
            <>
              <Stack direction="row" alignItems="end" justifyContent="space-between">
                <SearchInput placeholder="Search employee" />
                <Button
                  onClick={handleExport}
                  variant="outlined"
                  sx={{ height: 40, flexShrink: 0 }}
                >
                  Export
                </Button>
              </Stack>
              <TimesheetTable timesheets={timesheets} />
            </>
          )}
        </Stack>
      </Container>
    </PageLayout>
  );
};
