import { Menu, Stack, Typography } from '@mui/material';
import { CalendarToday as CalendarOutlined, RestartAltOutlined } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { alpha } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

import { useDisclosure } from '~/hooks/useDisclosure';
import { Button } from '~/components/ui';
import theme from '~/theme';
import { formatDate } from '~/utils/date';

export type DatePickerProps = {
  label?: string;
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
};

export const DatePicker = ({
  label,
  value,
  onChange,
}: DatePickerProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const [internalDate, setInternalDate] = useState<Dayjs | null>(value);
  const dateDisclosure = useDisclosure(false);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleCancel = () => {
    setInternalDate(value);
    handleClose();
  };
  const handleReset = () => {
    setInternalDate(dayjs());
  };
  const handleAccept = () => {
    onChange(internalDate);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outlined"
        sx={{
          width: 'fit-content',
          height: 40,
          justifyContent: 'flex-start',
          bgcolor: isOpen ? alpha(theme.palette.primary.light, 0.1) : 'background.paper',
        }}
        startIcon={<CalendarOutlined fontSize="small" sx={{ color: 'text.secondary' }} />}
      >
        <Stack direction="row" spacing={1}>
          {value ? (
            <Typography component="span" variant="body2">
              {formatDate(value.toISOString())}
            </Typography>
          ) : (
            <Typography component="span" variant="body2" color="text.secondary">
              {label || 'Select date'}
            </Typography>
          )}
        </Stack>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              px: 2,
              py: 1.5,
              mt: 1,
              minWidth: 260,
            },
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={1.5} sx={{ minWidth: 240 }}>
            {/* Single DatePicker */}
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

            {/* Form Actions */}
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <Button onClick={handleReset} startIcon={<RestartAltOutlined fontSize="inherit" />}>
                Reset
              </Button>
              <Stack direction="row" spacing={1}>
                <Button
                  disableElevation={true}
                  onClick={handleCancel}
                  type="button"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!internalDate}
                  type="submit"
                  variant="contained"
                  onClick={handleAccept}
                  color="primary"
                >
                  OK
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </LocalizationProvider>
      </Menu>
    </>
  );
};
