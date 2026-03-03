import { Stack, MenuItem, Typography, FormControl, FormHelperText, Box } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { Select } from '~/components/ui';
import type { ProductColor } from '~/services/product/product.types';

type ColorOption = {
  value: ProductColor;
  label: string;
  color: string;
};

const colorOptions: ColorOption[] = [
  { value: 'grey', label: 'Grey', color: '#9E9E9E' },
  { value: 'error', label: 'Red', color: 'error.main' },
  { value: 'warning', label: 'Orange', color: 'warning.main' },
  { value: 'success', label: 'Green', color: 'success.main' },
  { value: 'info', label: 'Blue', color: 'info.main' },
  { value: 'primary', label: 'Dark Green', color: 'primary.main' },
];

type ColorSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  size?: 'small' | 'medium';
};

export const ColorSelect = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  size = 'small',
}: ColorSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Stack spacing={0.5} width="100%" maxWidth="sm">
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
              value={value ?? 'grey'}
              onChange={(e) => onChange(e.target.value)}
              size={size}
              renderValue={(selected) => {
                const option = colorOptions.find((opt) => opt.value === selected);
                return (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircleIcon
                      sx={{
                        fontSize: 16,
                        color: option?.color === '#9E9E9E' ? '#9E9E9E' : option?.color,
                      }}
                    />
                    <Typography variant="body2">{option?.label}</Typography>
                  </Box>
                );
              }}
            >
              {colorOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircleIcon
                      sx={{
                        fontSize: 16,
                        color: option.color === '#9E9E9E' ? '#9E9E9E' : option.color,
                      }}
                    />
                    <Typography variant="body2">{option.label}</Typography>
                  </Box>
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
