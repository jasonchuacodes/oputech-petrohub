import { Controller, type Control } from 'react-hook-form';
import {
  FormControl,
  MenuItem,
  Select,
  Typography,
  Stack,
  FormHelperText,
} from '@mui/material';

import type { Shift } from '~/services/shift/shift.types';

type ShiftSelectProps = {
  control: Control<any>;
  name: string;
  label?: string;
  shifts: Shift[];
  disabled?: boolean;
};

export const ShiftSelect = ({ control, name, label, shifts, disabled }: ShiftSelectProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Stack spacing={0.5}>
          {label && (
            <Typography variant="body2" fontWeight="medium">
              {label}
            </Typography>
          )}
          <FormControl fullWidth error={!!error} disabled={disabled}>
            <Select value={value || ''} onChange={(e) => onChange(e.target.value || null)} displayEmpty size="small">
              <MenuItem value="">
                <em>No shift assigned</em>
              </MenuItem>
              {shifts.map((shift) => (
                <MenuItem key={shift.id} value={shift.id}>
                  {shift.name} (
                  {new Date(shift.shiftStart).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(shift.shiftEnd).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  )
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        </Stack>
      )}
    />
  );
};
