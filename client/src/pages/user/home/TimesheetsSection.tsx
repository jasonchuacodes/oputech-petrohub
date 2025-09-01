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
import dayjs from 'dayjs';

import { CardContainer } from '~/components/dashboard';
import { Link } from '~/components/ui';
import { useGetTodayTimesheetQuery } from '~/services/timesheet/timesheet.queries';
import {
  TimesheetEntryActionEnum,
  type TimesheetEntryAction,
} from '~/services/timesheet/timesheet.types';

const TimesheetEntryActionMap: Record<TimesheetEntryAction, string> = {
  [TimesheetEntryActionEnum.CHECK_IN]: 'CHECK IN',
  [TimesheetEntryActionEnum.CHECK_OUT]: 'CHECK OUT',
};

export const TimesheetsSection = () => {
  const { data: todayTimesheet, isLoading: isLoadingTimesheet } = useGetTodayTimesheetQuery();

  return (
    <>
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
              <CardContainer spacing={1}>
                {todayTimesheet ? (
                  <Stack spacing={1}>
                    <ListItem disablePadding>
                      <Stack direction="row" width="100%" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          {dayjs(todayTimesheet?.createdAt).format('MMM D, YYYY')}
                        </Typography>
                      </Stack>
                    </ListItem>
                    <Stack maxHeight={240} overflow="auto" paddingRight={2}>
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
                                  {dayjs(entry.timestamp).format('hh:mm A')}
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
                        {todayTimesheet?.totalHours}
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No timesheet entries for today.
                  </Typography>
                )}
              </CardContainer>
            </Stack>
          </List>
        </Stack>
      )}
    </>
  );
};
