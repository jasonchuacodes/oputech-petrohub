import {
  OutlinedInput,
  Stack,
  Typography,
  type OutlinedInputProps,
  type SxProps,
} from '@mui/material';
import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  label?: string;
  required?: boolean;

  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;

  size?: 'small' | 'medium';
  fullWidth?: boolean;
  sx?: SxProps;

  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  slotProps?: OutlinedInputProps['slotProps'];
  multiline?: boolean;
  rows?: number;
  error?: boolean;
};

export const Input = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder,
  type = 'text',
  disabled = false,
  size = 'small',
  fullWidth = true,
  sx,
  endAdornment,
  startAdornment,
  slotProps,
  multiline,
  rows,
  error: errorProp,
}: InputProps<T>) => {
  const mergedSlotProps = {
    input: {
      sx: {
        fontSize: 'body2.fontSize',
        ...slotProps?.input?.sx,
      },
    },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack spacing={0.5} width={fullWidth ? '100%' : 'auto'}>
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

          <OutlinedInput
            {...field}
            value={field.value ?? ''}
            type={type}
            size={size}
            fullWidth={fullWidth}
            placeholder={placeholder}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            error={error?.message ? true : errorProp}
            slotProps={mergedSlotProps}
            endAdornment={endAdornment}
            startAdornment={startAdornment}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: '1px',
              },
              bgcolor: 'background.paper',
              borderRadius: 2,
              ...sx,
            }}
          />

          {errorProp && error?.message && (
            <Typography fontSize="small" color="error">
              {error.message}
            </Typography>
          )}
        </Stack>
      )}
    />
  );
};
