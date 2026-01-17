import {
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Skeleton,
  Divider,
} from '@mui/material';

import { CardContainer, Link } from '~/components/ui';
import { useGetTodayTimesheetQuery } from '~/services/timesheet/timesheet.queries';
import { TimesheetEntryActionMap } from '~/services/timesheet/timesheet.types';
import { formatDate, formatTime } from '~/utils/date';

export const TimesheetsSection = () => {
  const { data: todayTimesheet, isLoading: isLoadingTimesheet } = useGetTodayTimesheetQuery();

  return (
    <CardContainer>
      {isLoadingTimesheet ? (
        <Skeleton height={96} variant="rounded" />
      ) : (
        <Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography fontWeight="bold">Recent Logs</Typography>
            <Link
              to="/timesheets"
              alignSelf="flex-start"
              sx={{ fontSize: 'small', color: 'text.main' }}
            >
              Show All
            </Link>
          </Stack>
          <List>
            <Stack spacing={1}>
              {todayTimesheet ? (
                <Stack spacing={1}>
                  <ListItem disablePadding>
                    <Stack direction="row" width="100%" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(todayTimesheet?.createdAt)}
                      </Typography>
                    </Stack>
                  </ListItem>
                  <Stack maxHeight={120} overflow="auto" paddingRight={1}>
                    {todayTimesheet?.entries.map((entry) => (
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
                                {formatTime(entry.timestamp)}
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                    ))}
                  </Stack>
                  <Divider />
                  <Stack direction="row" spacing={0.5}>
                    <Typography variant="body2">Total Hours:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {todayTimesheet?.totalHours.toFixed(2)}
                    </Typography>
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No timesheet entries for today.
                </Typography>
              )}
            </Stack>
          </List>
        </Stack>
      )}
    </CardContainer>
  );
};
