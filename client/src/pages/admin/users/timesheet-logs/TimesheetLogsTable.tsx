import {
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { Paper } from '~/components/ui';
import theme from '~/theme';
import { type Timesheet } from '~/services/timesheet/timesheet.types';

import { TimesheetRow } from './TimesheetRow';

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
            <TableCell align="left">Actions</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {timesheets?.map((timesheet) => {
            return <TimesheetRow key={timesheet.id} {...timesheet} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
