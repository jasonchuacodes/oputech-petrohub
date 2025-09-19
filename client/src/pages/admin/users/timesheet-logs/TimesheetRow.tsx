import {
  ChevronRightOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
} from '@mui/icons-material';
import {
  alpha,
  Collapse,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import {
  TimesheetEntryActionEnum,
  TimesheetEntryActionMap,
  type Timesheet,
} from '~/services/timesheet/timesheet.types';
import theme from '~/theme';

export const TimesheetRow = ({ createdAt, entries, id, totalHours }: Timesheet) => {
  const [open, setOpen] = useState(false);

  const firstCheckIn = entries.find((e) => e.action === TimesheetEntryActionEnum.CHECK_IN);

  const lastCheckOut = [...entries]
    .reverse()
    .find((e) => e.action === TimesheetEntryActionEnum.CHECK_OUT);

  return (
    <React.Fragment>
      <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell component="th" scope="row" sx={{ maxWidth: 240 }}>
          {dayjs(createdAt).format('MMMM DD, YYYY')}
        </TableCell>
        <TableCell align="left">
          <Tooltip title="First In">
            <Typography variant="body2">
              {firstCheckIn ? dayjs(firstCheckIn.timestamp).format('hh:mm A') : '—'}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align="left">
          <Tooltip title="Last Out">
            <Typography variant="body2">
              {lastCheckOut ? dayjs(lastCheckOut.timestamp).format('hh:mm A') : '—'}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell align="left">{totalHours.toFixed(2)} hrs</TableCell>
        <TableCell align="left">
          <IconButton onClick={() => null} size="small">
            <EditOutlined fontSize="inherit" />
          </IconButton>
          <IconButton onClick={() => null} size="small">
            <DeleteOutlineOutlined fontSize="inherit" />
          </IconButton>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={() => setOpen(!open)} size="small">
            <ChevronRightOutlined fontSize="small" sx={{ rotate: '90deg' }} />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Timesheet Entries */}
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
              <Typography variant="body1">Timesheet entries:</Typography>
              {entries.map(({ id, timestamp, action }) => {
                return (
                  <Stack key={id} direction="row" spacing={2} paddingLeft={2}>
                    <Typography variant="body2">{dayjs(timestamp).format('hh:mm:ss A')}</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>&mdash;</Typography>
                    <Typography variant="body2">{TimesheetEntryActionMap[action]}</Typography>
                  </Stack>
                );
              })}
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
