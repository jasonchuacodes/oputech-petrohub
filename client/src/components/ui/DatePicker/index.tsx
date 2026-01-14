import { Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

import { useDisclosure } from '~/hooks/useDisclosure';

import { Show } from '../Show';

export type DatePickerProps = {
  label?: string;
  value: Dayjs | null;
};

export const DatePicker = ({ label, value }: DatePickerProps) => {
  const [internalDate, setInternalDate] = useState<Dayjs | null>(value);
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
          value={internalDate}
          onOpen={() => dateDisclosure.setOpen(true)}
          onClose={() => dateDisclosure.setOpen(false)}
          onChange={(newValue) => {
            setInternalDate(newValue);
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
