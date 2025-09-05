import {
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect } from 'react';

import { Link, Paper } from '~/components/ui';
import type { Timesheet } from '~/services/timesheet/timesheet.types';
import theme from '~/theme';

import { MoreDetailsMenu } from './MoreDetailsMenu';

export const TimesheetTable = ({ timesheets }: { timesheets?: Timesheet[] }) => {
  
  const weeklyTimesheets = [
    { id: 'eb2cab22-e5fb-449d-97d4-a6873fdcdb61', name: 'Jonathan Doe', totalHours: 40.2 },
    { id: 'eb2cab22-e5fb-449d-97d4-a6873fdcdb62', name: 'Jane Doe', totalHours: 42.2 },
    { id: 'eb2cab22-e5fb-449d-97d4-a6873fdcdb63', name: 'Jackson Villa', totalHours: 40.2 },
    { id: 'eb2cab22-e5fb-449d-97d4-a6873fdcdb64', name: 'Emily Rose', totalHours: 40.2 },
  ];
  
  // TODO: integrate collated timesheet logs and render on timesheet table
  useEffect(() => {
    console.log('Timesheets: ', timesheets);
  }, [timesheets]);
  
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
          {weeklyTimesheets &&
            weeklyTimesheets.map(({ id, name, totalHours }) => (
              <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" sx={{ maxWidth: 240 }}>
                  <Link to={id}>{name}</Link>
                </TableCell>
                <TableCell align="left">{totalHours}</TableCell>
                <TableCell align="left">
                  <MoreDetailsMenu id={id} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
