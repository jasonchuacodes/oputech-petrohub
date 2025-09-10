import {
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';

import { Paper } from '~/components/ui';
import theme from '~/theme';
import { TimesheetEntryActionEnum, type Timesheet } from '~/services/timesheet/timesheet.types';

import { MoreDetailsMenu } from './MoreDetailsMenu';

export const TimesheetLogsTable = ({ timesheets }: { timesheets: Timesheet[] }) => {
  return (
    <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
          <TableRow>
            <TableCell sx={{ maxWidth: 240 }}>Date</TableCell>
            <TableCell align="left">Check In</TableCell>
            <TableCell align="left">Check Out</TableCell>
            <TableCell align="left">Total Hours</TableCell>
            <TableCell align="left" />
          </TableRow>
        </TableHead>

        <TableBody>
          {timesheets?.map(({ id, entries, createdAt, totalHours }) => {
            const firstCheckIn = entries.find(
              (e) => e.action === TimesheetEntryActionEnum.CHECK_IN,
            );

            const lastCheckOut = [...entries]
              .reverse()
              .find((e) => e.action === TimesheetEntryActionEnum.CHECK_OUT);

            return (
              <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ maxWidth: 240 }}>
                  {dayjs(createdAt).format('MMMM DD, YYYY')}
                </TableCell>
                <TableCell align="left">
                  {firstCheckIn ? dayjs(firstCheckIn.timestamp).format('hh:mm A') : '—'}
                </TableCell>
                <TableCell align="left">
                  {lastCheckOut ? dayjs(lastCheckOut.timestamp).format('hh:mm A') : '—'}
                </TableCell>
                <TableCell align="left">{totalHours.toFixed(2)} hrs</TableCell>
                <TableCell align="left">
                  <MoreDetailsMenu id={id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
