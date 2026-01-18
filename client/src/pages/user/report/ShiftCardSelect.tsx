import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Show } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { UserRoutes } from '~/routes';
import { useGetReportByShiftQuery } from '~/services/report/report.queries';
import type { Shift } from '~/services/shift/shift.types';
import { dayjsLocal, formatTime } from '~/utils/date';

type ShiftCardSelectProps = {
  shifts: Shift[];
  onSelectShift: (shift: Shift) => void;
};

export const ShiftCardSelect = ({ shifts, onSelectShift }: ShiftCardSelectProps) => {
  const { auth } = useAuthContext();
  const tenantId = auth?.tenantId || null;

  const navigate = useNavigate();
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  useEffect(() => {
    if (shifts.length > 0 && !selectedShift) {
      setSelectedShift(shifts[0]);
    }
  }, [shifts, selectedShift]);

  const { data: report, isFetching } = useGetReportByShiftQuery({
    tenantId: tenantId!,
    shiftId: selectedShift?.id,
    shiftDate: dayjsLocal().startOf('day').toISOString(),
  });

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        {shifts.map((shift) => (
          <Stack
            key={shift.id}
            onClick={() => setSelectedShift(shift)}
            gap={1}
            p={2}
            bgcolor={selectedShift?.id === shift.id ? 'primary.alpha' : undefined}
            borderRadius={2}
            border="1px solid"
            borderColor={selectedShift?.id === shift.id ? 'primary.main' : 'divider'}
            sx={{ transition: 'all 0.2s' }}
          >
            <Typography variant="body1" fontWeight={600}>
              {shift.name} Shift
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(shift.shiftStart as unknown as string)} —{' '}
              {formatTime(shift.shiftEnd as unknown as string)}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Show
        when={!!report}
        fallback={
          <Button
            disabled={!selectedShift || isFetching}
            size="large"
            onClick={() => onSelectShift(selectedShift!)}
            variant="contained"
          >
            Create Report
          </Button>
        }
      >
        <Button
          disabled={!selectedShift || isFetching}
          size="large"
          onClick={() => navigate(`${UserRoutes.Report}/${report!.id}`)}
          variant="contained"
        >
          View Report
        </Button>
      </Show>
    </Stack>
  );
};
