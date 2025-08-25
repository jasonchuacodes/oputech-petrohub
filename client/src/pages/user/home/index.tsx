import { Stack } from '@mui/material';

import { PageLayout } from '~/components/ui';

import { DateTimeDisplay } from './DateTimeDisplay';
import { TimeLogger } from './TimeLogger';
import { Timesheets } from './Timesheets';

export const HomePage = () => {
  return (
    <PageLayout p={2} spacing={4}>
      <Stack spacing={1}>
        <DateTimeDisplay />
        <TimeLogger />
      </Stack>

      <Timesheets />
    </PageLayout>
  );
};
