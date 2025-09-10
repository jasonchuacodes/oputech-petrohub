import {
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { Link, Paper } from '~/components/ui';
import type { Timesheet } from '~/services/timesheet/timesheet.types';
import theme from '~/theme';

import { MoreDetailsMenu } from './MoreDetailsMenu';

type GroupedTimesheets = {
  userId: string;
  userName: string;
  timesheets: Timesheet[];
};

export const TimesheetTable = ({ timesheets }: { timesheets: Timesheet[] }) => {
  const groupedTimesheets = timesheets?.reduce<Record<string, GroupedTimesheets>>(
    (acc, timesheet) => {
      const key = timesheet.user.id;

      if (!acc[key]) {
        acc[key] = {
          userId: timesheet.user.id,
          userName: timesheet.user.name,
          timesheets: [],
        };
      }

      acc[key].timesheets.push(timesheet);

      return acc;
    },
    {},
  );

  const groups = Object.values(groupedTimesheets ?? {});

  return (
    <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
          <TableRow>
            <TableCell sx={{ maxWidth: 240 }}>Name</TableCell>
            <TableCell align="left">Total Hours</TableCell>
            <TableCell align="left" />
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map(({ userId, userName, timesheets }) => {
            const totalHours = timesheets.reduce((sum, t) => sum + t.totalHours, 0);

            return (
              <TableRow key={userId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ maxWidth: 240 }}>
                  <Link to={userId}>{userName}</Link>
                </TableCell>
                <TableCell align="left">{totalHours}</TableCell>
                <TableCell align="left">
                  <MoreDetailsMenu id={userId} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
