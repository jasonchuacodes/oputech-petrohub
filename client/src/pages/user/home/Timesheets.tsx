import { Stack, Typography, List, ListItem, ListItemText, Chip } from '@mui/material';
import dayjs from 'dayjs';

import { CardContainer } from '~/components/dashboard';
import { Link } from '~/components/ui';
import { userTimesheets } from '~/data/mockUserTimesheets';
import { toTitleCase } from '~/utils/textUtils';

export const Timesheets = () => {
  const latestEntries = userTimesheets
    .flatMap((t) =>
      t.entries.map((entry) => ({
        ...entry,
        user: t.user,
        timesheetId: t.id,
        totalHours: t.totalHours,
      })),
    )
    .sort((a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf())
    .slice(0, 5);

  const groupedEntries = latestEntries.reduce(
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
          {Object.entries(groupedEntries).map(([date, group]) => (
            <CardContainer key={date} spacing={1}>
              <ListItem disablePadding>
                <Stack direction="row" width="100%" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {date}
                  </Typography>
                </Stack>
              </ListItem>
              <Stack>
                {group.entries.map((entry) => (
                  <ListItem key={entry.id} sx={{ py: 0.5, px: 0 }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Chip size="small" label={toTitleCase(entry.action)} variant="outlined" />
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
      </List>
    </Stack>
  );
};
