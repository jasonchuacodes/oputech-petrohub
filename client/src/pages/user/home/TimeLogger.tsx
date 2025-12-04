import { alpha, Typography } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { CardContainer, Switch } from '~/components/ui';
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetTodayTimesheetQuery,
} from '~/services/timesheet/timesheet.queries';
import { TimesheetEntryActionEnum, type Timesheet } from '~/services/timesheet/timesheet.types';
import theme from '~/theme';
import { parseBackendError } from '~/utils/parseBackendError';

dayjs.extend(duration);

export const TimeLogger = () => {
  const [elapsed, setElapsed] = useState('00:00:00');

  const { data: timesheet, isLoading: isLoadingTimesheet } = useGetTodayTimesheetQuery();
  const { mutate: checkIn, isPending: isPendingCheckIn } = useCheckInMutation();
  const { mutate: checkOut, isPending: isPendingCheckOut } = useCheckOutMutation();

  const latestEntry = useMemo(() => {
    if (!timesheet?.entries?.length) return undefined;

    return timesheet.entries.reduce((latest, entry) =>
      new Date(entry.timestamp) > new Date(latest.timestamp) ? entry : latest,
    );
  }, [timesheet]);

  const isCheckedIn = latestEntry?.action === TimesheetEntryActionEnum.CHECK_IN;

  const styles = {
    borderColor: isCheckedIn ? theme.palette.success.light : theme.palette.grey[400],
    bgcolor: isCheckedIn
      ? alpha(theme.palette.success.dark, 0.1)
      : alpha(theme.palette.grey[600], 0.2),
  };

  useEffect(() => {
    const getElapsedTime = (timesheet: Timesheet | null): number => {
      if (!timesheet?.entries?.length) return 0;

      const entries = timesheet.entries;
      let totalSeconds = 0;
      const now = Date.now();

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];

        if (entry.action === TimesheetEntryActionEnum.CHECK_IN) {
          const nextEntry = entries[i + 1];
          const checkInTime = new Date(entry.timestamp).getTime();

          if (nextEntry?.action === TimesheetEntryActionEnum.CHECK_OUT) {
            const checkOutTime = new Date(nextEntry.timestamp).getTime();
            totalSeconds += checkOutTime - checkInTime;
            i++;
          } else {
            totalSeconds += now - checkInTime;
          }
        }
      }

      return Math.floor(totalSeconds / 1000);
    };

    const tick = () => {
      const secs = getElapsedTime(timesheet ?? null);

      const formatElapsed = (totalSeconds: number): string => {
        const d = dayjs.duration(totalSeconds, 'seconds');

        const hh = String(d.hours() + d.days() * 24).padStart(2, '0');
        const mm = String(d.minutes()).padStart(2, '0');
        const ss = String(d.seconds()).padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
      };

      setElapsed(formatElapsed(secs));
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [timesheet]);

  const handleToggle = () => {
    if (!isCheckedIn) {
      checkIn(undefined, {
        onSuccess: () => {
          toast.success('Checked in successfully');
        },
        onError: (err) => {
          const errorMessage = parseBackendError(err);
          toast.error(`Failed to check in: ${errorMessage}`);
        },
      });
    } else {
      checkOut(undefined, {
        onSuccess: () => {
          toast.success('Checked out successfully');
        },
      });
    }
  };

  return (
    <CardContainer direction="row" justifyContent="space-between" alignItems="center" sx={styles}>
      <Typography fontWeight="bold" color={isCheckedIn ? 'success.dark' : 'text.primary'}>
        {isCheckedIn ? `In ${elapsed} hrs` : 'Check In'}
      </Typography>

      <Switch
        disabled={isLoadingTimesheet || isPendingCheckIn || isPendingCheckOut}
        checked={isCheckedIn}
        onChange={handleToggle}
        value={isCheckedIn}
      />
    </CardContainer>
  );
};
