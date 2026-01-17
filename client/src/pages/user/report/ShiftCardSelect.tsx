import { Stack, Typography } from '@mui/material';

import { Button } from '~/components/ui';
import { formatTime } from '~/utils/date';
import type { Shift } from '~/services/shift/shift.types';

type ShiftCardSelectProps = {
  shifts: Shift[];
  onSelectShift: (shift: Shift) => void;
  isLoading?: boolean;
};

export const ShiftCardSelect = ({
  shifts,
  onSelectShift,
  isLoading = false,
}: ShiftCardSelectProps) => {
  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        {shifts.map((shift) => (
          <Button
            key={shift.id}
            onClick={() => onSelectShift(shift)}
            disabled={isLoading}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: 1,
              p: 2,
              bgcolor: 'primary.alpha',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {shift.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
              }}
            >
              {formatTime(shift.shiftStart as unknown as string)} —{' '}
              {formatTime(shift.shiftEnd as unknown as string)}
            </Typography>
          </Button>
        ))}
      </Stack>
    </Stack>
  );
};
