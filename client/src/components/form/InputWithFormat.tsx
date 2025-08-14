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
  mode?: 'view' | 'edit';
};

export const InputWithFormat = <T extends object>({
  name,
  label,
  control,
  placeholder,
  pattern,
  required,
  variant = 'outlined',
  mode = 'edit',
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => {
        const safeValue = value ?? '';
        const maxRawLength = (pattern.match(/9/g) || []).length;
        const rawDigits = safeValue.replace(/\D/g, '').slice(0, maxRawLength);

        const { formatted } = formatDigitsWithPattern(rawDigits, pattern);

        return (
          <Stack spacing={0.5} width="100%">
            <Typography fontWeight="bold" color="text.secondary">
              {label}
              {required && (
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              )}
            </Typography>

            {mode === 'edit' ? (
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
              />
            ) : (
              <Typography height={40}>
                {formatted === '' || formatted === null ? 'N/A' : formatted}
              </Typography>
            )}
          </Stack>
        );
      }}
    />
  );
};
