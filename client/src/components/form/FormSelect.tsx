import {
  Stack,
  MenuItem,
  Typography,
  FormControl,
  FormHelperText,
  type SelectProps as MUISelectProps,
} from '@mui/material';
import type { PropsWithChildren } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { Select } from '~/components/ui';

type SelectOption = {
  label: string;
  value: string;
};

type FormSelectProps<T extends FieldValues> = PropsWithChildren<{
  name: Path<T>;
  control: Control<T>;

  label?: string;
  required?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';

  options?: SelectOption[];
  renderValue?: MUISelectProps['renderValue'];
  displayEmpty?: boolean;
  MenuProps?: MUISelectProps['MenuProps'];
  sx?: MUISelectProps['sx'];
}>;

export const FormSelect = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder,
  size = 'small',
  options,
  children,
  renderValue,
  displayEmpty,
  MenuProps,
  sx,
}: FormSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Stack spacing={0.5} width="100%">
          {label && (
            <Typography variant="body2" fontWeight="medium" color="text.primary">
              {label}
              {required && (
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              )}
            </Typography>
          )}

          <FormControl fullWidth error={!!error}>
            <Select
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value || null)}
              size={size}
              displayEmpty={displayEmpty}
              renderValue={renderValue}
              MenuProps={MenuProps}
              sx={sx}
            >
              {placeholder && displayEmpty && (
                <MenuItem value="">
                  <Typography variant="body2" color="text.secondary">
                    {placeholder}
                  </Typography>
                </MenuItem>
              )}

              {options
                ? options.map(({ label: optLabel, value: optValue }) => (
                    <MenuItem key={`option-${optValue}`} value={optValue}>
                      <Typography variant="body2">{optLabel}</Typography>
                    </MenuItem>
                  ))
                : children}
            </Select>

            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        </Stack>
      )}
    />
  );
};
