import { Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';

import { useDisclosure } from '~/hooks/useDisclosure';

import { Show } from '../Show';

export type DateTimePickerProps = {
  label?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  disablePast?: boolean;
  disableFuture?: boolean;
};

export const DateTimePicker = ({
  label,
  value,
  onChange,
  disablePast,
  disableFuture,
}: DateTimePickerProps) => {
  const dateDisclosure = useDisclosure(false);

  return (
    <Stack spacing={0.5}>
      <Show when={!!label}>
        <Typography variant="body2" fontWeight="medium" color="text.primary">
          {label || 'Select date and time'}
        </Typography>
      </Show>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MuiDateTimePicker
          value={value}
          onOpen={() => dateDisclosure.setOpen(true)}
          onClose={() => dateDisclosure.setOpen(false)}
          onChange={(newValue) => {
            onChange?.(newValue);
          }}
          open={dateDisclosure.open}
          disablePast={disablePast}
          disableFuture={disableFuture}
          slotProps={{
            textField: {
              size: 'small',
              sx: {
                width: '100%',
                borderRadius: 2,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              },
              InputProps: {
                sx: {
                  fontSize: 'body2.fontSize',
                  borderRadius: 2,

                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },

                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'text.primary',
                  },

                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'text.primary',
                    borderWidth: 1,
                  },
                },
              },
            },
          }}
          slots={{
            toolbar: undefined,
          }}
        />
      </LocalizationProvider>
    </Stack>
  );
};
