import { Box, Container, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

import { SearchInput } from '~/components/form';
import { Button, DateRangePicker, LoadingSpinner, PageLayout } from '~/components/ui';

import { TimesheetTable } from './TimesheetTable';

dayjs.extend(weekday);

const startOfWeek = dayjs().weekday(0);
const endOfWeek = dayjs().weekday(6);

export const TimesheetsPage = () => {
  const isLoading = false;

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
              initialStart={startOfWeek}
              initialEnd={endOfWeek}
              label="Select Time Period"
            />
          </Stack>

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" pt={10}>
              <LoadingSpinner />
            </Box>
          ) : (
            <>
              <Stack direction="row" justifyContent="space-between">
                <SearchInput placeholder="Search employee" />
                <Button onClick={handleExport} variant="outlined">
                  Export
                </Button>
              </Stack>
              <TimesheetTable />
            </>
          )}
        </Stack>
      </Container>
    </PageLayout>
  );
};
