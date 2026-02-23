import { Box, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { Widget } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetDailyTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import { UserStatusEnum } from '~/services/timesheet/timesheet.types';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

const STATUS_COLOR_MAP = {
  onTime: { label: 'On Time', color: 'info' as const },
  late: { label: 'Late', color: 'error' as const },
};

export const TimesheetCard = () => {
  const { tenantId } = useTenantContext();
  const { data: users = [] } = useGetDailyTimesheetsQuery({ tenantId });

  const navigateTo = pathFor({
    pathname: AdminRoutes.TenantTimesheets,
    params: { tenantId },
  });

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

  return (
    <Widget title="Attendance" to={navigateTo}>
      <Stack spacing={0}>
        {/* Header */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            px: 2,
            height: 40,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.surface',
          }}
        >
          <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>
            Full Name
          </Typography>
          <Typography variant="body2" sx={{ width: 100, color: 'text.secondary' }}>
            Status
          </Typography>
        </Stack>

        {/* Body */}
        {users.length === 0 ? (
          <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No timesheets found
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0}>
            {users.map((user) => (
              <Stack
                key={user.id}
                direction="row"
                spacing={2}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: 1,
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 0,
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                  <Box component="span">{renderStatus(user.status)}</Box>
                  <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                    {user.name}
                  </Typography>
                </Stack>
                <Box sx={{ width: 100, whiteSpace: 'nowrap' }}>{getStatusChip(user)}</Box>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Widget>
  );
};
