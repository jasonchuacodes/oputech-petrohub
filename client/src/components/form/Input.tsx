import { Box, OutlinedInput, Stack, Typography, type OutlinedInputProps } from '@mui/material';
import type { FocusEventHandler, HTMLInputTypeAttribute, ReactNode } from 'react';
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

  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
  slotProps?: OutlinedInputProps['slotProps'];
  multiline?: boolean;
  rows?: number;
  error?: boolean;
  autoFocus?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  min?: string | number;
  max?: string | number;
  step?: string | number;
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
  endAdornment,
  startAdornment,
  slotProps,
  multiline,
  rows,
  error: errorProp,
  autoFocus,
  onBlur,
  min,
  max,
  step,
}: InputProps<T>) => {
  const inputProps = {
    ...(step !== undefined && { step }),
    ...(min !== undefined && { min }),
    ...(max !== undefined && { max }),
  };

  const mergedSlotProps = {
    input: {
      sx: {
        fontSize: {
          xs: 'body1.fontSize',
          sm: 'body2.fontSize',
        },
        ...(startAdornment && { pl: 1 }),
        ...slotProps?.input?.sx,
      },
      ...slotProps?.input,
    },
    root: {
      sx: {
        ...(startAdornment && { padding: 0 }),
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'divider',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: '2px',
        },
        ...(multiline ? { minHeight: { xs: 44, sm: 40 } } : { height: { xs: 44, sm: 40 } }),
        bgcolor: 'background.paper',
        borderRadius: 2,
      },
    },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack
          alignItems="start"
          spacing={0.5}
          width={fullWidth ? '100%' : 'auto'}
          maxWidth={fullWidth ? 'auto' : 'sm'}
        >
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
            onBlur={(e) => {
              field.onBlur();
              onBlur?.(e);
            }}
            value={field.value ?? ''}
            type={type}
            size={size}
            fullWidth={fullWidth}
            placeholder={placeholder}
            disabled={disabled}
            multiline={multiline}
            rows={rows}
            error={error?.message ? true : errorProp}
            autoFocus={autoFocus}
            slotProps={mergedSlotProps}
            inputProps={inputProps}
            endAdornment={endAdornment}
            startAdornment={
              startAdornment ? (
                <Box
                  sx={{
                    display: 'flex',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    px: 2,
                    m: 0,
                  }}
                >
                  {startAdornment}
                </Box>
              ) : undefined
            }
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
