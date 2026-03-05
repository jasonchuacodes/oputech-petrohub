import { alpha, Box, MenuItem, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Control } from 'react-hook-form';

import { FormDatePicker, FormSelect, Input, NumberInput } from '~/components/form';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import type { Shift } from '~/services/shift/shift.types';
import { EmploymentStatus } from '~/services/user/user.types';
import type { User } from '~/services/user/user.types';
import { RateType } from '~/services/salary/salary.types';
import type { UpdateUserPayload } from '~/schema/updateUserSchema';
import theme from '~/theme';
import { pathFor } from '~/utils/pathFor';
import { toTitleCase } from '~/utils/textUtils';

import { ShiftSelect } from './ShiftSelect';

interface EmploymentDetailProps {
  control: Control<UpdateUserPayload>;
  shifts: Shift[];
  user?: User;
}

export const EmploymentDetail = ({ control, shifts, user }: EmploymentDetailProps) => {
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();

  return (
    <Stack spacing={3} bgcolor="background.paper" borderRadius={2} p={2}>
      <Typography variant="body1" fontWeight={600}>
        Employment Details
      </Typography>

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          {user?.employeeId != null && (
            <Stack spacing={0.5} width="100%">
              <Typography variant="body2" fontWeight="medium">
                Employee ID
              </Typography>
              <Box
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: alpha(theme.palette.grey[100], 0.8),
                  px: 1.5,
                  py: 0.5,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2">EMP-{user.employeeId}</Typography>
              </Box>
            </Stack>
          )}
          <Input
            control={control}
            name="position"
            label="Position"
            placeholder="Operations Manager"
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <FormDatePicker control={control} name="hireDate" label="Hire Date" />
          <FormSelect control={control} name="status" label="Employment Status">
            {Object.values(EmploymentStatus).map((status) => (
              <MenuItem key={status} value={status}>
                <Typography variant="body2">{toTitleCase(status)}</Typography>
              </MenuItem>
            ))}
          </FormSelect>
        </Stack>

        <Stack spacing={2} direction="row">
          <NumberInput
            startAdornment="₱"
            control={control}
            width="50%"
            fullWidth={false}
            name="rate"
            label="Salary Rate"
            placeholder="0.00"
            min={0}
          />

          <FormSelect control={control} name="rateType" label="Rate Type" width="50%">
            {Object.values(RateType).map((rateType) => (
              <MenuItem key={rateType} value={rateType}>
                <Typography variant="body2">{toTitleCase(rateType)}</Typography>
              </MenuItem>
            ))}
          </FormSelect>
        </Stack>
        
        <Stack direction="row" spacing={2}>
          <ShiftSelect control={control} label="Shift Schedule" name="shiftId" shifts={shifts} />
          <Box width="100%" />
        </Stack>

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
      </Stack>
    </Stack>
  );
};
