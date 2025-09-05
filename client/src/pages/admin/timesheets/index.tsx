import { Box, Container, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';

import { SearchInput } from '~/components/form';
import { Button, DateRangePicker, LoadingSpinner, PageLayout } from '~/components/ui';
import { useGetAllTimesheetsQuery } from '~/services/timesheet/timesheet.queries';

import { TimesheetTable } from './TimesheetTable';

dayjs.extend(weekday);
dayjs.extend(utc);

export const TimesheetsPage = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().weekday(0).startOf('day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().weekday(6).endOf('day'));

  // TODO: implement query invalidation on daterange selection
  const handleSelectStart = (date: Dayjs | null) => {
    if (!date) {
      setStartDate(null);
      return;
    }
    setStartDate(date.startOf('day'));
  };

  const { data: timesheets, isLoading } = useGetAllTimesheetsQuery({ startDate, endDate });

  const handleSelectEnd = (date: Dayjs | null) => {
    if (!date) {
      setEndDate(null);
      return;
    }
    setEndDate(date.endOf('day'));
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
              startDate={startDate ?? null}
              endDate={endDate ?? null}
              onSelectStart={handleSelectStart}
              onSelectEnd={handleSelectEnd}
              label="Select Time Period"
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
