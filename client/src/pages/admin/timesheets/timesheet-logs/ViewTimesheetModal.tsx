import { CalendarMonthOutlined } from '@mui/icons-material';
import { Divider, Stack, Typography } from '@mui/material';

import { CustomModal } from '~/components/ui';
import { useTimesheetLogContext } from '~/context/timesheetLog';
import {
  TimesheetEntryActionMap,
  TimesheetEntryActionEnum,
} from '~/services/timesheet/timesheet.types';
import { formatDate, formatTime } from '~/utils/date';

type ViewTimesheetModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ViewTimesheetModal = ({ open, onClose }: ViewTimesheetModalProps) => {
  const { timesheetLog } = useTimesheetLogContext();
  const { createdAt, entries, totalHours } = timesheetLog;

  const firstCheckIn = entries.find((e) => e.action === TimesheetEntryActionEnum.CHECK_IN);
  const lastCheckOut = [...entries]
    .reverse()
    .find((e) => e.action === TimesheetEntryActionEnum.CHECK_OUT);

  return (
    <CustomModal
      onClose={onClose}
      open={open}
      title="Timesheet Details"
      maxWidth={500}
      icon={CalendarMonthOutlined}
      hideActions
    >
      <Stack spacing={3} sx={{ textAlign: 'start' }}>
        {/* Summary Section */}
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center">
            <Typography variant="body2" color="text.secondary" width="50%">
              Date
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(createdAt)}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography variant="body2" color="text.secondary" width="50%">
              First Check In
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {firstCheckIn ? formatTime(firstCheckIn.timestamp) : '—'}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography variant="body2" color="text.secondary" width="50%">
              Last Check Out
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {lastCheckOut ? formatTime(lastCheckOut.timestamp) : '—'}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <Typography variant="body2" color="text.secondary" width="50%">
              Total Hours
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {totalHours.toFixed(2)} hrs
            </Typography>
          </Stack>
        </Stack>

        <Divider />

        {/* Entries Section */}
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            Timesheet Entries:
          </Typography>
          <Stack spacing={1.5}>
            {entries.map(({ id, timestamp, action }) => (
              <Stack key={id} direction="row" alignItems="center" spacing={2} paddingLeft={2}>
                <Stack direction="row" width="50%" alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 80 }}>
                    {formatTime(timestamp)}
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Stack>
                <Typography
                  variant="caption"
                  fontWeight="medium"
                  color={
                    action === TimesheetEntryActionEnum.CHECK_IN ? 'success.main' : 'error.main'
                  }
                >
                  {TimesheetEntryActionMap[action]}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </CustomModal>
  );
};
