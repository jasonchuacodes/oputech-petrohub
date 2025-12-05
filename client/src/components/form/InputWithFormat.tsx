import { Stack, TextField, Typography } from '@mui/material';
import { Controller, type Control, type Path } from 'react-hook-form';

import { formatDigitsWithPattern } from '~/utils/textUtils';

type Props<T extends object> = {
  name: Path<T>;
  control: Control<T>;
  pattern: string;
  required?: boolean;
  placeholder?: string;
  label?: string;
  variant?: 'standard' | 'outlined' | 'filled';
};

export const InputWithFormat = <T extends object>({
  name,
  label,
  control,
  placeholder,
  pattern,
  required,
  variant = 'outlined',
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field }, fieldState: { error }  }) => {
        const safeValue = value ?? '';
        const maxRawLength = (pattern.match(/9/g) || []).length;
        const rawDigits = safeValue.replace(/\D/g, '').slice(0, maxRawLength);

        const { formatted } = formatDigitsWithPattern(rawDigits, pattern);

        return (
          <Stack spacing={0.5} width="100%">
            <Typography variant="body2" fontWeight="medium" color="text.secondary">
              {label}
              {required && (
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              )}
            </Typography>

            <TextField
              {...field}
              fullWidth
              size="small"
              variant={variant}
              placeholder={placeholder}
              value={formatted}
              onChange={(e) => {
                const rawDigits = e.target.value.replace(/\D/g, '');
                const slicedRaw = rawDigits.slice(0, maxRawLength);
                onChange(slicedRaw === '' ? null : slicedRaw);
              }}
              slotProps={{
                htmlInput: {
                  sx: {
                    fontSize: 'body2.fontSize',
                  },
                },
              }}
            />

            {error?.message && (
              <Typography fontSize="small" color="error">
                {error.message}
              </Typography>
            )}
          </Stack>
        );
      }}
    />
  );
};
