import { Controller, type Control } from 'react-hook-form';
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const BASE_DATE = '1970-01-01';

interface TimePickerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  mode: 'view' | 'edit';
  disabled?: boolean;
}

export const TimePicker = ({ control, name, label, mode, disabled }: TimePickerProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        if (mode === 'view') {
          const displayValue = value ? dayjs(value).format('h:mm A') : '-';
          return (
            <div>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {label}
              </Typography>
              <Typography variant="body1">{displayValue}</Typography>
            </div>
          );
        }

        const dayjsValue = value ? dayjs(value) : null;

        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MuiTimePicker
              value={dayjsValue}
              disabled={disabled}
              onChange={(newValue: Dayjs | null) => {
                if (newValue) {
                  const timeOnBaseDate = dayjs
                    .tz(BASE_DATE, dayjs.tz.guess())
                    .set('hour', newValue.hour())
                    .set('minute', newValue.minute())
                    .set('second', 0)
                    .set('millisecond', 0)
                    .utc()
                    .toDate();
                  onChange(timeOnBaseDate);
                } else {
                  onChange(null);
                }
              }}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                  fullWidth: true,
                  size: 'small',
                  InputProps: {
                    sx: {
                      fontSize: 'body2.fontSize',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        );
      }}
    />
  );
};
