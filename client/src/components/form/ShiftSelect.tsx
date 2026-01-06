import { Controller, type Control, type FieldValues, type FieldPath } from 'react-hook-form';
import { FormControl, MenuItem, Typography, Stack, FormHelperText, Divider } from '@mui/material';

import { Select } from '~/components/ui/Select';
import type { Shift } from '~/services/shift/shift.types';
import { formatTime } from '~/utils/date';

type ShiftSelectProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  shifts: Shift[];
  disabled?: boolean;
};

export const ShiftSelect = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  shifts,
  disabled,
}: ShiftSelectProps<TFieldValues>) => {
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
            <Select
              value={value || ''}
              onChange={(e) => onChange(e.target.value || null)}
              displayEmpty
              size="small"
              renderValue={(selected) => {
                if (!selected) return <Typography variant="body2">No shift assigned</Typography>;

                const shift = shifts.find((s) => s.id === selected);
                if (!shift) return null;

                return (
                  <Stack direction="row" spacing={2} width="100%">
                    <Typography variant="body2">{shift.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`(${formatTime(String(shift.shiftStart))} — ${formatTime(String(shift.shiftEnd))})`}
                    </Typography>
                  </Stack>
                );
              }}
            >
              <MenuItem value="">
                <Typography variant="body2">No shift assigned</Typography>
              </MenuItem>
              <Divider />
              {shifts.map((shift) => (
                <MenuItem
                  key={shift.id}
                  value={shift.id}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography variant="body2">{shift.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatTime(String(shift.shiftStart))} — {formatTime(String(shift.shiftEnd))}
                  </Typography>
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
