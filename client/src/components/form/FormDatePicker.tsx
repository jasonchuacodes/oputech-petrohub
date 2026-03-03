import { Stack, ThemeProvider, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { useDisclosure } from '~/hooks/useDisclosure';
import theme from '~/theme';

type FormDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
};

export const FormDatePicker = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  placeholder,
}: FormDatePickerProps<T>) => {
  const dateDisclosure = useDisclosure(false);

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

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={theme}>
              <MuiDatePicker
                value={value ? dayjs(value) : null}
                onOpen={() => dateDisclosure.setOpen(true)}
                onClose={() => dateDisclosure.setOpen(false)}
                onChange={(newValue) => {
                  onChange(newValue ? newValue.toISOString() : null);
                }}
                open={dateDisclosure.open}
                slotProps={{
                  textField: {
                    size: 'small',
                    placeholder,
                    error: !!error,
                    helperText: error?.message,
                    InputProps: {
                      sx: {
                        '& .MuiPickersOutlinedInput-notchedOutline': {
                          borderColor: 'divider',
                        },
                        '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
                          borderWidth: '2px',
                        },
                        fontSize: 'body2.fontSize',
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                      },
                    },
                  },
                  actionBar: {
                    actions: ['cancel', 'accept'],
                  },
                }}
                slots={{
                  toolbar: undefined,
                }}
              />
            </ThemeProvider>
          </LocalizationProvider>
        </Stack>
      )}
    />
  );
};
