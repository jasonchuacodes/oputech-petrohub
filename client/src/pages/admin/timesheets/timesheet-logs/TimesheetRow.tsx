import { ChevronRightOutlined } from '@mui/icons-material';
import {
  alpha,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useTimesheetLogContext } from '~/context/timesheetLog';
import {
  TimesheetEntryActionEnum,
  TimesheetEntryActionMap,
} from '~/services/timesheet/timesheet.types';
import theme from '~/theme';
import { formatDate, formatTime } from '~/utils/date';

import { TimesheetActions } from './TimesheetActions';

export const TimesheetRow = () => {
  const { timesheetLog } = useTimesheetLogContext();
  const { createdAt, entries, id: timesheetId, totalHours } = timesheetLog;

  const [open, setOpen] = useState(false);

  const firstCheckIn = entries.find((e) => e.action === TimesheetEntryActionEnum.CHECK_IN);
  const lastCheckOut = [...entries]
    .reverse()
    .find((e) => e.action === TimesheetEntryActionEnum.CHECK_OUT);

  return (
    <>
      <TableRow
        key={timesheetId}
        sx={{
          height: 80,
          '&:last-child td, &:last-child th': { border: 0 },
        }}
      >
        <TableCell component="th" scope="row" sx={{ maxWidth: 240 }}>
          {formatDate(createdAt)}
        </TableCell>
        <TableCell align="left">
          <Tooltip title="First In">
            <Typography variant="body2">
              {firstCheckIn ? formatTime(firstCheckIn.timestamp) : '—'}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align="left">
          <Tooltip title="Last Out">
            <Typography variant="body2">
              {lastCheckOut ? formatTime(lastCheckOut.timestamp) : '—'}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{`${totalHours.toFixed(2)} hrs`}</Typography>
        </TableCell>

        <TableCell>
          <TimesheetActions />
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={() => setOpen(!open)} size="small">
            <ChevronRightOutlined fontSize="small" sx={{ rotate: '90deg' }} />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Timesheet Entries Collapse */}
      <TableRow
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: 0,
          '&:last-child td, &:last-child th': { border: 0 },
        }}
      >
        <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack margin={1} spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Timesheet entries:
              </Typography>
              {entries.map(({ id, timestamp, action }) => (
                <Stack key={id} direction="row" alignItems="center" spacing={2} paddingLeft={2}>
                  <Typography variant="body2">{formatTime(timestamp)}</Typography>
                  <Divider sx={{ width: 120 }} />
                  <Typography variant="body2">{TimesheetEntryActionMap[action]}</Typography>
                </Stack>
              ))}
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
