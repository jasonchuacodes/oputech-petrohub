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
      <Stack spacing={3}>
        {/* Summary Section */}
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(createdAt)}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              First Check In
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {firstCheckIn ? formatTime(firstCheckIn.timestamp) : '—'}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Last Check Out
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {lastCheckOut ? formatTime(lastCheckOut.timestamp) : '—'}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
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
            Timesheet Entries
          </Typography>
          <Stack spacing={1.5}>
            {entries.map(({ id, timestamp, action }) => (
              <Stack key={id} direction="row" alignItems="center" spacing={2} paddingLeft={2}>
                <Typography variant="body2" sx={{ minWidth: 80 }}>
                  {formatTime(timestamp)}
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color={
                    action === TimesheetEntryActionEnum.CHECK_IN ? 'success.main' : 'error.main'
                  }
                  sx={{ minWidth: 100, textAlign: 'right' }}
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
