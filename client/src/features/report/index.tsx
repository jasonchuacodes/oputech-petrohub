import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Box, CircularProgress, Typography } from '@mui/material';

import { NoData, PageLayout, Button, Show } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import {
  useCreateReportMutation,
  useGetReportByShiftQuery,
} from '~/services/report/report.queries';
import { useGetShiftsQuery } from '~/services/shift/shift.queries';
import type { Shift } from '~/services/shift/shift.types';
import { dayjsLocal } from '~/utils/date';
import { UserRoutes } from '~/routes';

import { ShiftCard } from './ShiftCard';

export const Report = () => {
  const { auth } = useAuthContext();
  const navigate = useNavigate();

  const tenantId = auth?.tenantId || null;

  const { data: shifts, isLoading: shiftsLoading } = useGetShiftsQuery(tenantId!);
  const { mutateAsync: createReport, isPending: isCreatingReport } = useCreateReportMutation();

  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const shiftDate = dayjsLocal().startOf('day').toISOString();

  const handleShiftSelect = useCallback(
    async (shift: Shift) => {
      if (!tenantId) return;

      const result = await createReport({
        tenantId,
        shiftId: shift.id,
        shiftDate: dayjsLocal().startOf('day').toISOString(),
      });

      navigate(`${UserRoutes.Report}/${result.id}`);
    },
    [createReport, navigate, tenantId],
  );

  useEffect(() => {
    if (shifts && shifts.length > 0 && !selectedShift) {
      setSelectedShift(shifts[0]);
    }
  }, [shifts, selectedShift]);

  const { data: report, isFetching } = useGetReportByShiftQuery({
    tenantId: tenantId!,
    shiftId: selectedShift?.id,
    shiftDate,
  });

  if (shiftsLoading) {
    return (
      <PageLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  return (
      <Stack spacing={2} p={2} flex={1}>
        {!!shifts && shifts.length > 0 ? (
          <Stack spacing={1}>
            <Typography variant="body2" color="text.primary">
              Please select a shift schedule:
            </Typography>

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
                    loading={isCreatingReport}
                    disabled={!selectedShift || isFetching}
                    size="large"
                    onClick={() => handleShiftSelect(selectedShift!)}
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
          </Stack>
        ) : (
          <NoData
            text="No shifts found"
            description="There are no shifts configured. Please contact your administrator or refresh the page and try again."
          />
        )}
      </Stack>
  );
};
