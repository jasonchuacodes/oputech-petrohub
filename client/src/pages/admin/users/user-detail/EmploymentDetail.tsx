import { MenuItem, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Control } from 'react-hook-form';

import { FormSelect, NumberInput } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import type { Shift } from '~/services/shift/shift.types';
import { RateType } from '~/services/salary/salary.types';
import type { UpdateUserPayload } from '~/schema/updateUserSchema';
import { pathFor } from '~/utils/pathFor';

import { ShiftSelect } from './ShiftSelect';

interface EmploymentDetailProps {
  control: Control<UpdateUserPayload>;
  shifts: Shift[];
}

export const EmploymentDetail = ({ control, shifts }: EmploymentDetailProps) => {
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();

  return (
    <Stack spacing={3} bgcolor="background.paper" borderRadius={2} p={2}>
      <Typography variant="body1" fontWeight={600}>
        Employment Details
      </Typography>

      {/* TODO: add these user info */}
      {/* employee id */}
      {/* hire date */}
      {/* employment status : transferred from user personal detail */}
      {/* position */}

      <Stack spacing={2}>
        <ShiftSelect control={control} label="Shift Schedule" name="shiftId" shifts={shifts} />

        {shifts.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            Shift schedules have not been set. Please add a shift scheduled on the{' '}
            <Typography
              variant="caption"
              color="info"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() =>
                navigate(
                  pathFor({
                    pathname: AdminRoutes.TenantShifts,
                    params: { tenantId },
                  }),
                )
              }
            >
              shift configuration
            </Typography>{' '}
            page.
          </Typography>
        )}

        <Stack spacing={2} direction="row">
          <NumberInput
            startAdornment="₱"
            control={control}
            width={400}
            fullWidth={false}
            name="rate"
            label="Salary Rate"
            placeholder="0.00"
            min={0}
            step={1}
          />

          <FormSelect control={control} name="rateType" label="Rate Type" width={400}>
            <MenuItem value={RateType.HOURLY}>
              <Typography variant="body2">Hourly</Typography>
            </MenuItem>
            <MenuItem value={RateType.DAILY}>
              <Typography variant="body2">Daily</Typography>
            </MenuItem>
          </FormSelect>
        </Stack>
      </Stack>
    </Stack>
  );
};
