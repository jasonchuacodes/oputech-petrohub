import { OpenInNewOutlined } from '@mui/icons-material';
import {
  alpha,
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import { TimesheetEntryActionEnum, timesheets } from '~/data/mockAllTimesheets';
import theme from '~/theme';

export const Widget = () => {
  return (
    <Stack
      bgcolor="background.paper"
      border="1px solid"
      borderColor="divider"
      borderRadius={1}
      p={2}
      spacing={2}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography fontWeight="medium" variant="body1">
          Timesheet Logs
        </Typography>
        <IconButton onClick={() => null} size="small">
          <OpenInNewOutlined fontSize="inherit" />
        </IconButton>
      </Stack>
      {/* Content */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider' }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
            <TableRow>
              <TableCell sx={{ maxWidth: 240 }}>User</TableCell>
              <TableCell align="left">Check In</TableCell>
              <TableCell align="left">Check Out</TableCell>
              <TableCell align="left" sx={{ width: 200 }}>
                Total Hours
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {timesheets?.map((timesheet) => {
              const { entries, id: timesheetId, totalHours, user } = timesheet;

              const firstCheckIn = entries.find(
                (e) => e.action === TimesheetEntryActionEnum.CHECK_IN,
              );

              const lastCheckOut = [...entries]
                .reverse()
                .find((e) => e.action === TimesheetEntryActionEnum.CHECK_OUT);

              return (
                <TableRow
                  key={timesheetId}
                  sx={{
                    height: 80,
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ maxWidth: 240 }}>
                    {user.name}
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
                  <TableCell width={200}>
                    {lastCheckOut ? (
                      `${totalHours.toFixed(2)} hrs`
                    ) : (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'warning.main',
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Pending
                        </Typography>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
