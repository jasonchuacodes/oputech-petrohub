import { Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

import { useDisclosure } from '~/hooks/useDisclosure';

import { Show } from '../Show';

export type DatePickerProps = {
  label?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
};

export const DatePicker = ({ label, value, onChange }: DatePickerProps) => {
  const dateDisclosure = useDisclosure(false);

  return (
    <Stack spacing={0.5}>
      <Show when={!!label}>
        <Typography variant="body2" fontWeight="medium" color="text.primary">
          {label || 'Select date'}
        </Typography>
      </Show>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MuiDatePicker
          value={value}
          onOpen={() => dateDisclosure.setOpen(true)}
          onClose={() => dateDisclosure.setOpen(false)}
          onChange={(newValue) => {
            onChange?.(newValue);
            dateDisclosure.setOpen(false);
          }}
          open={dateDisclosure.open}
          slotProps={{
            textField: {
              size: 'small',
              sx: { width: '100%' },
              InputProps: {
                sx: { fontSize: 'body2.fontSize' },
              },
            },
            actionBar: { actions: ['clear'] },
          }}
          slots={{
            toolbar: undefined,
          }}
        />
      </LocalizationProvider>
    </Stack>
  );
};
