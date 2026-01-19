import { Box, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { DataTable, Widget } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useTimesheetPusher } from '~/hooks/useTimesheetPusher';
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

  useTimesheetPusher();

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
    <Widget title="Daily Timesheet" to={navigateTo}>
      <DataTable
        id="admin-users-table"
        collection={DataTable.collection({
          items: users || [],
          itemToValue: (user) => user.id,
          itemToString: (user) => user.name,
        })}
        columns={[
          {
            id: 'name',
            heading: 'Full Name',
            cell: (user) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box component="span">{renderStatus(user.status)}</Box>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                  {user.name}
                </Typography>
              </Stack>
            ),
            orderable: true,
          },
          {
            id: 'checkIn',
            heading: 'Check In',
            cell: (user) => (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {formatTime(user.checkIn)}
              </Typography>
            ),
            orderable: true,
            width: 160,
          },
          {
            id: 'checkOut',
            heading: 'Check Out',
            cell: (user) => (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {formatTime(user.checkOut)}
              </Typography>
            ),
            orderable: true,
            width: 160,
          },
          {
            id: 'status',
            heading: 'Status',
            cell: (user) => <Box sx={{ whiteSpace: 'nowrap' }}>{getStatusChip(user)}</Box>,
            orderable: false,
            width: 160,
          },
          {
            id: 'notes',
            heading: 'Notes',
            cell: (user) => (
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user.notes}
              </Typography>
            ),
            orderable: false,
            width: 240,
          },
        ]}
        emptyMessage="No timesheets found"
      />
    </Widget>
  );
};
