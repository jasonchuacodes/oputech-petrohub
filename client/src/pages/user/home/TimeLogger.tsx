import { alpha, Typography } from '@mui/material';
import { useMemo } from 'react';
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

export const TimeLogger = () => {
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
        {isCheckedIn ? 'Checked In' : 'Check In'}
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
