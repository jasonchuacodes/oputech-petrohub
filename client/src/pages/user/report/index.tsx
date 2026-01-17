import { Stack, Box, CircularProgress, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ShiftCardSelect } from './ShiftCardSelect';

import { NoData, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useCreateReportMutation } from '~/services/report/report.queries';
import { dayjsLocal } from '~/utils/date';
import { UserRoutes } from '~/routes';
import { useGetShiftsQuery } from '~/services/shift/shift.queries';
import type { Shift } from '~/services/shift/shift.types';

export const ReportPage = () => {
  const { auth } = useAuthContext();
  const navigate = useNavigate();

  const tenantId = auth?.tenantId || null;

  const { data: shifts, isLoading: shiftsLoading } = useGetShiftsQuery(tenantId!);
  const { mutateAsync: createReport, isPending: isCreating } = useCreateReportMutation();

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
    <PageLayout>
      <Stack spacing={2} p={2} bgcolor="background.paper" flex={1}>
        {!!shifts && shifts.length > 0 ? (
          <Stack spacing={1}>
            <Typography variant="body1" color="text.primary">Select a Shift:</Typography>
            <ShiftCardSelect
              shifts={shifts}
              onSelectShift={handleShiftSelect}
              isLoading={isCreating}
            />
          </Stack>
        ) : (
          <NoData text="You have not been assigned to a shift." />
        )}
      </Stack>
    </PageLayout>
  );
};
