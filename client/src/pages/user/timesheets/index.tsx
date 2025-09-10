import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  alpha,
  Skeleton,
} from '@mui/material';
import dayjs from 'dayjs';

import { CardContainer } from '~/components/dashboard';
import { DateRangePicker, PageLayout } from '~/components/ui';
import theme from '~/theme';
import { useGetUserTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import { TimesheetEntryActionMap } from '~/services/timesheet/timesheet.types';

export const TimesheetsPage = () => {
  const { data: timesheets, isLoading: isLoadingTimesheets } = useGetUserTimesheetsQuery({});

  const latestEntries = timesheets
    ?.flatMap((t) =>
      t.entries.map((entry) => ({
        ...entry,
        user: t.user,
        timesheetId: t.id,
        totalHours: t.totalHours,
      })),
    )
    .sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf());

  const groupedEntries = latestEntries?.reduce(
    (acc, entry) => {
      const dateKey = dayjs(entry.timestamp).format('MMM D, YYYY');
      if (!acc[dateKey]) {
        acc[dateKey] = { entries: [], totalHours: entry.totalHours };
      }

      acc[dateKey].entries.push(entry);
      return acc;
    },
    {} as Record<string, { entries: typeof latestEntries; totalHours: number }>,
  );

  return (
    <PageLayout p={2} spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        {/* TODO: implement query invalidation on daterange selection */}
        <DateRangePicker
          label="Select Time Period"
          selectedStart={null}
          selectedEnd={null}
          onAccept={() => null}
        />
      </Stack>
      <Stack padding={2} bgcolor={alpha(theme.palette.info.dark, 0.2)} borderRadius={1}>
        <Typography variant="body2">Total Hours:</Typography>
        {isLoadingTimesheets ? (
          <Skeleton width={40} height={32} />
        ) : (
          <Typography variant="h6" fontWeight="bold">
            {timesheets?.reduce((sum, t) => sum + t.totalHours, 0) ?? 0}
          </Typography>
        )}
      </Stack>
      <List>
        {isLoadingTimesheets ? (
          <Stack spacing={1}>
            {Array.from({ length: 3 }).map((_, index) => {
              return <Skeleton key={index} height={160} variant="rounded" />;
            })}
          </Stack>
        ) : (
          <Stack spacing={1}>
            {groupedEntries &&
              Object.entries(groupedEntries).map(([date, group]) => (
                <CardContainer key={date} spacing={1}>
                  <ListItem disablePadding>
                    <Stack direction="row" width="100%" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {date}
                      </Typography>
                    </Stack>
                  </ListItem>
                  <Stack maxHeight={240} overflow="auto" paddingRight={1}>
                    {group.entries.map((entry) => (
                      <ListItem key={entry.id} sx={{ py: 0.5, px: 0 }}>
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Chip
                                size="small"
                                label={TimesheetEntryActionMap[entry.action]}
                                variant="outlined"
                              />
                              <Typography variant="caption" color="text.secondary">
                                {dayjs(entry.timestamp).format('hh:mm A')}
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <Typography variant="body2">Total Hours:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {group.totalHours}
                    </Typography>
                  </Stack>
                </CardContainer>
              ))}
          </Stack>
        )}
      </List>
    </PageLayout>
  );
};
