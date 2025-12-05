import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';

import { NoData, Widget } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetDailyTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import { UserStatusEnum } from '~/services/timesheet/timesheet.types';
import { AdminRoutes } from '~/routes';
import { formatTime } from '~/utils/date';
import { pathFor } from '~/utils/pathFor';

const STATUS_COLOR_MAP = {
  onTime: { label: 'On Time', color: 'info' as const },
  late: { label: 'Late', color: 'error' as const },
};

export const TimesheetWidget = () => {
  const { tenantId } = useTenantContext();
  const { data: users = [] } = useGetDailyTimesheetsQuery({ tenantId });

  const navigateTo = pathFor({
    pathname: AdminRoutes.TenantTimesheets,
    params: { tenantId },
  });

  const renderStatus = (status: string) => {
    const isIn = status === UserStatusEnum.IN;
    const color = isIn ? 'success.main' : 'text.disabled';

    return (
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: color,
        }}
      />
    );
  };

  const getStatusChip = (user: { checkIn: string | null; shiftStart: string | null }) => {
    if (!user.checkIn || !user.shiftStart) return '-';

    const checkInTime = dayjs(user.checkIn);
    const shiftTime = dayjs(user.shiftStart);

    const expectedCheckIn = checkInTime.hour(shiftTime.hour()).minute(shiftTime.minute()).second(0);

    const isLate = checkInTime.isAfter(expectedCheckIn);
    const statusConfig = isLate ? STATUS_COLOR_MAP.late : STATUS_COLOR_MAP.onTime;

    return (
      <Chip size="small" label={statusConfig.label} variant="outlined" color={statusConfig.color} />
    );
  };

  return (
    <Widget title="Daily Timesheet" to={navigateTo}>
      {users.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            maxHeight: 450,
            overflowY: 'auto',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Full Name</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Check In</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Check Out</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                <TableCell sx={{ minWidth: 240, whiteSpace: 'nowrap' }}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box component="span">{renderStatus(user.status)}</Box>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                        {user.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatTime(user.checkIn)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatTime(user.checkOut)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{getStatusChip(user)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'error',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user.notes}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <NoData text="No users found" />
      )}
    </Widget>
  );
};
