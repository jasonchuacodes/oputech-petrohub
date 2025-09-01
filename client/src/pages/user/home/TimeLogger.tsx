import { alpha, Typography } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { CardContainer } from '~/components/dashboard';
import { Switch } from '~/components/ui';
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetTodayTimesheetQuery,
} from '~/services/timesheet/timesheet.queries';
import { TimesheetEntryActionEnum } from '~/services/timesheet/timesheet.types';
import theme from '~/theme';

dayjs.extend(duration);

export const TimeLogger = () => {
  const [elapsed, setElapsed] = useState('00:00:00');

  const { data: timesheet, isLoading: isLoadingTimesheet } = useGetTodayTimesheetQuery();

  const latestEntry = useMemo(() => {
    if (!timesheet?.entries?.length) return undefined;

    return timesheet.entries.reduce((latest, entry) =>
      new Date(entry.timestamp) > new Date(latest.timestamp) ? entry : latest,
    );
  }, [timesheet]);

  const isCheckedIn = useMemo(() => {
    if (!latestEntry) return false;

    return latestEntry.action === TimesheetEntryActionEnum.CHECK_IN;
  }, [latestEntry]);

  useEffect(() => {
    if (!isCheckedIn || !latestEntry) {
      setElapsed('00:00:00');
      return;
    }

    const checkInTime = dayjs(latestEntry.timestamp);

    const tick = () => {
      const diffMs = dayjs().diff(checkInTime);
      const d = dayjs.duration(diffMs);

      const hh = String(d.hours()).padStart(2, '0');
      const mm = String(d.minutes()).padStart(2, '0');
      const ss = String(d.seconds()).padStart(2, '0');

      setElapsed(`${hh}:${mm}:${ss}`);
    };

    tick();

    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [isCheckedIn, latestEntry]);

  const styles = {
    borderColor: isCheckedIn ? theme.palette.success.light : theme.palette.grey[400],
    bgcolor: isCheckedIn
      ? alpha(theme.palette.success.dark, 0.1)
      : alpha(theme.palette.grey[600], 0.2),
  };

  const { mutate: checkIn, isPending: isPendingCheckIn } = useCheckInMutation();
  const { mutate: checkOut, isPending: isPendingCheckOut } = useCheckOutMutation();

  const handleToggle = () => {
    if (!isCheckedIn) {
      checkIn(undefined, {
        onSuccess: () => {
          toast.success('Checked in successfully');
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
