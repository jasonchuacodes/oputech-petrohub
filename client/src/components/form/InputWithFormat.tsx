import { OutlinedInput, Stack, Typography } from '@mui/material';
import { Controller, type Control, type Path } from 'react-hook-form';

import { formatDigitsWithPattern } from '~/utils/textUtils';

type Props<T extends object> = {
  name: Path<T>;
  control: Control<T>;
  pattern: string;
  required?: boolean;
  placeholder?: string;
  label?: string;
  error?: boolean;
};

export const InputWithFormat = <T extends object>({
  name,
  label,
  control,
  placeholder,
  pattern,
  required,
  error: errorProp,
}: Props<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field }, fieldState: { error } }) => {
        const safeValue = value ?? '';
        const maxRawLength = (pattern.match(/9/g) || []).length;
        const rawDigits = safeValue.replace(/\D/g, '').slice(0, maxRawLength);

        const { formatted } = formatDigitsWithPattern(rawDigits, pattern);

        return (
          <Stack alignItems="start" spacing={0.5} width="100%" maxWidth="sm">
            <Typography variant="body2" fontWeight="medium" color="text.primary">
              {label}
              {required && (
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              )}
            </Typography>

            <OutlinedInput
              {...field}
              fullWidth
              size="small"
              placeholder={placeholder}
              value={formatted}
              onChange={(e) => {
                const rawDigits = e.target.value.replace(/\D/g, '');
                const slicedRaw = rawDigits.slice(0, maxRawLength);
                onChange(slicedRaw === '' ? null : slicedRaw);
              }}
              error={error?.message ? true : false}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'divider',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderWidth: 2,
                },
                bgcolor: 'background.paper',
                borderRadius: 2,
              }}
              slotProps={{
                input: {
                  sx: {
                    fontSize: {
                      xs: 'body1.fontSize',
                      sm: 'body2.fontSize',
                    },
                  },
                },
              }}
            />

            {errorProp && error?.message && (
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
