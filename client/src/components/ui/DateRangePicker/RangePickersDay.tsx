import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { alpha } from '@mui/material/styles';
import { memo } from 'react';
import theme from '~/theme';

interface RangePickersDayProps extends PickersDayProps {
  isInRange?: boolean;
  isStartOfRange?: boolean;
  isEndOfRange?: boolean;
  isHovering?: boolean;
}

const RangePickersDayComponent = ({
  isInRange = false,
  isStartOfRange = false,
  isEndOfRange = false,
  isHovering = false,
  ...rest
}: RangePickersDayProps) => {
  const isRangeEdge = isStartOfRange || isEndOfRange;

  return (
    <PickersDay
      {...rest}
      sx={{
        ...((isStartOfRange || isEndOfRange) && {
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 600,
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
          },
        }),
        ...(isInRange && !isRangeEdge && {
          bgcolor: alpha(theme.palette.primary.main, 0.12),
          borderRadius: 0,
        }),
        ...(isHovering && !isRangeEdge && {
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          border: `1px dashed ${theme.palette.primary.light}`,
        }),
      }}
    />
  );
};

export const RangePickersDay = memo(RangePickersDayComponent);

export default RangePickersDay;
