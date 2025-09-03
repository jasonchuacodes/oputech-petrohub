import { Box, Container, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

import { SearchInput } from '~/components/form';
import { DateRangePicker, LoadingSpinner, PageLayout } from '~/components/ui';

dayjs.extend(weekday);

export const TimesheetsPage = () => {
  const isLoading = false;

  const startOfWeek = dayjs().weekday(0);
  const endOfWeek = dayjs().weekday(6);

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
              <SearchInput placeholder="Search employee" />
              {/* User Timesheets table - display timesheet summary per user for all users*/}
            </>
          )}
        </Stack>
      </Container>
    </PageLayout>
  );
};
