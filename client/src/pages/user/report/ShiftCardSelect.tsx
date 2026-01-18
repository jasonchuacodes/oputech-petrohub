import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Show } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { UserRoutes } from '~/routes';
import { useGetReportByShiftQuery } from '~/services/report/report.queries';
import type { Shift } from '~/services/shift/shift.types';
import { dayjsLocal } from '~/utils/date';

import { ShiftCard } from './ShiftCard';

type ShiftCardSelectProps = {
  shifts: Shift[];
  onSelectShift: (shift: Shift) => void;
  isLoading?: boolean;
};

export const ShiftCardSelect = ({ shifts, onSelectShift, isLoading }: ShiftCardSelectProps) => {
  const { auth } = useAuthContext();
  const tenantId = auth?.tenantId || null;

  const navigate = useNavigate();
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const shiftDate = dayjsLocal().startOf('day').toISOString();

  useEffect(() => {
    if (shifts.length > 0 && !selectedShift) {
      setSelectedShift(shifts[0]);
    }
  }, [shifts, selectedShift]);

  const { data: report, isFetching } = useGetReportByShiftQuery({
    tenantId: tenantId!,
    shiftId: selectedShift?.id,
    shiftDate,
  });

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        {shifts.map((shift) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            tenantId={tenantId!}
            shiftDate={shiftDate}
            isSelected={selectedShift?.id === shift.id}
            onClick={setSelectedShift}
          />
        ))}
      </Stack>

      <Show
        when={!!report}
        fallback={
          <Button
            loading={isLoading}
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
