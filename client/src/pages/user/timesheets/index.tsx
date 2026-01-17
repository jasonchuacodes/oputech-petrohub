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
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import {
  CardContainer,
  DateRangePicker,
  PageLayout,
  SkeletonList,
  type DateRange
} from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useGetUserTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import { TimesheetEntryActionMap } from '~/services/timesheet/timesheet.types';
import theme from '~/theme';
import { getInitialDateRange } from '~/utils/date';

const TIMESHEETS_KEY = 'timesheetRange';

export const TimesheetsPage = () => {
  const { auth } = useAuthContext();
  const initialRange = useMemo(() => getInitialDateRange(TIMESHEETS_KEY), []);

  const [startDate, setStartDate] = useState<Dayjs | null>(initialRange.startDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialRange.endDate);

  const userId = auth?.id;
  const tenantId = auth?.tenantId;

  const { data: timesheets, isLoading: isLoadingTimesheets } = useGetUserTimesheetsQuery({
    tenantId,
    userId,
  });

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

  return (
    <PageLayout>
      <Stack spacing={2} p={2} bgcolor="background.paper" flex={1}>
        <Stack direction="row" justifyContent="space-between">
        <DateRangePicker
          label="Select Time Period"
          selectedStart={startDate}
          selectedEnd={endDate}
          onAccept={handleSelectDateRange}
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
            <SkeletonList height={160} rows={3} />
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
      </Stack>
    </PageLayout>
  );
};
