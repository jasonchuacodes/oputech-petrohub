import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { alpha } from '@mui/material/styles';
import { memo } from 'react';
import theme from '~/theme';

interface WeekPickersDayProps extends PickersDayProps {
  isInSelectedWeek?: boolean;
  isWeekStart?: boolean;
  isWeekEnd?: boolean;
  isHovering?: boolean;
}

const WeekPickersDayComponent = ({
  isInSelectedWeek = false,
  isWeekStart = false,
  isWeekEnd = false,
  isHovering = false,
  ...rest
}: WeekPickersDayProps) => {
  return (
    <PickersDay
      {...rest}
      sx={{
        ...(isInSelectedWeek && {
          bgcolor: alpha(theme.palette.primary.main, 0.12),
          fontWeight: 600,
          borderRadius: 0,
          ...(isWeekStart && {
            borderTopLeftRadius: 3,
            borderBottomLeftRadius: 3,
          }),
          ...(isWeekEnd && {
            borderTopRightRadius: 3,
            borderBottomRightRadius: 3,
          }),
        }),
        ...(isHovering && !isInSelectedWeek && {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          borderRadius: 0,
          ...(isWeekStart && {
            borderTopLeftRadius: 3,
            borderBottomLeftRadius: 3,
          }),
          ...(isWeekEnd && {
            borderTopRightRadius: 3,
            borderBottomRightRadius: 3,
          }),
        }),
      }}
    />
  );
};

export const WeekPickersDay = memo(WeekPickersDayComponent);

export default WeekPickersDay;
