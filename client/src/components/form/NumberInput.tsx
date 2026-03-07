import { Box, Button, OutlinedInput, Stack, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { ReactNode } from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

type NumberInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;

  label?: string;
  required?: boolean;

  placeholder?: string;
  disabled?: boolean;

  size?: 'small' | 'medium';
  fullWidth?: boolean;

  startAdornment?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  error?: boolean;
  autoFocus?: boolean;
  width?: number | string;
};

export const NumberInput = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder,
  disabled = false,
  size = 'medium',
  fullWidth = true,
  startAdornment,
  min,
  max,
  step = 0.01,
  error: errorProp,
  autoFocus,
  width,
}: NumberInputProps<T>) => {
  // Calculate decimal places from step for rounding
  const getDecimalPlaces = (stepValue: number) => {
    const stepStr = stepValue.toString();
    if (stepStr.includes('.')) {
      return stepStr.split('.')[1].length;
    }
    return 0;
  };

  const decimalPlaces = getDecimalPlaces(step);

  const roundToStep = (value: number) => {
    return Number(value.toFixed(decimalPlaces));
  };

  const slotProps = {
    input: {
      sx: {
        fontSize: {
          xs: 'body1.fontSize',
          sm: 'body2.fontSize',
        },
        ...(startAdornment && { pl: 1 }),
        '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        '&[type=number]': {
          MozAppearance: 'textfield',
        },
      },
    },
    root: {
      sx: {
        ...(startAdornment && { padding: 0 }),
        pr: 0,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'divider',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: '2px',
        },
        height: {
          xs: 44,
          sm: 40,
        },
        bgcolor: 'background.paper',
        borderRadius: 2,
      },
    },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const currentValue = field.value as number | undefined;

        const handleIncrement = () => {
          const numValue = Number(currentValue) || 0;
          const newValue = roundToStep(numValue + step);
          if (max !== undefined && newValue > max) return;
          field.onChange(newValue);
        };

        const handleDecrement = () => {
          const numValue = Number(currentValue) || 0;
          const newValue = roundToStep(numValue - step);
          if (min !== undefined && newValue < min) return;
          field.onChange(newValue);
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          if (value === '') {
            field.onChange('');
            return;
          }
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            field.onChange(roundToStep(numValue));
          }
        };

        return (
          <Stack alignItems='start' spacing={0.5} width={fullWidth ? '100%' : width ? width : 'auto'} maxWidth="sm">
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
              onChange={handleInputChange}
              type="number"
              size={size}
              fullWidth={fullWidth}
              placeholder={placeholder}
              disabled={disabled}
              error={error?.message ? true : errorProp}
              autoFocus={autoFocus}
              slotProps={slotProps}
              inputProps={{
                ...(step !== undefined && { step }),
                ...(min !== undefined && { min }),
                ...(max !== undefined && { max }),
              }}
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
              endAdornment={
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                    alignSelf: 'stretch',
                  }}
                >
                  <Button
                    onClick={handleIncrement}
                    disabled={
                      disabled ||
                      (max !== undefined && currentValue !== undefined && currentValue >= max)
                    }
                    sx={{
                      minWidth: 40,
                      minHeight: 0,
                      flex: 1,
                      p: 0,
                      borderRadius: '0 8px 0 0',
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                      },
                    }}
                  >
                    <KeyboardArrowUpIcon fontSize="small" />
                  </Button>
                  <Button
                    onClick={handleDecrement}
                    disabled={
                      disabled ||
                      (min !== undefined && currentValue !== undefined && currentValue <= min)
                    }
                    sx={{
                      minWidth: 40,
                      minHeight: 0,
                      flex: 1,
                      p: 0,
                      borderRadius: '0 0 8px 0',
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        color: 'primary.main',
                      },
                    }}
                  >
                    <KeyboardArrowDownIcon fontSize="small" />
                  </Button>
                </Box>
              }
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
