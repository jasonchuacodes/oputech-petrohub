import { Menu, Stack, Typography } from '@mui/material';
import { CalendarToday as CalendarOutlined } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { alpha } from '@mui/material/styles';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

import theme from '~/theme';
import { Button } from '~/components/ui';

type DateRangePickerProps = {
  label?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  onSelectStart: (date: Dayjs | null) => void;
  onSelectEnd: (date: Dayjs | null) => void;
};

export const DateRangePicker = ({
  label,
  startDate,
  endDate,
  onSelectStart,
  onSelectEnd,
}: DateRangePickerProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Stack spacing={1}>
      <Button
        onClick={handleOpen}
        fullWidth
        variant="outlined"
        sx={{
          justifyContent: 'flex-start',
          p: 1,
          bgcolor: isOpen ? alpha(theme.palette.primary.light, 0.1) : '',
        }}
        startIcon={<CalendarOutlined fontSize="small" />}
      >
        <Stack direction="row" spacing={1}>
          <Typography component="span" color="text.secondary">
            Time period:
          </Typography>

          {startDate || endDate ? (
            <Typography component="span">
              {startDate ? startDate.format('MM/DD/YY') : 'MM/DD/YY'}
              {' - '}
              {endDate ? endDate.format('MM/DD/YY') : 'MM/DD/YY'}
            </Typography>
          ) : (
            <Typography component="span">{label}</Typography>
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
            {/* Start Date */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
                sx={{ minWidth: 70 }}
              >
                Start Date
              </Typography>
              <DatePicker
                value={startDate}
                onOpen={() => setIsStartOpen(true)}
                onClose={() => setIsStartOpen(false)}
                onChange={(newValue) => {
                  onSelectStart(newValue);
                  setIsStartOpen(false);
                }}
                open={isStartOpen}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { width: 168 },
                  },
                  actionBar: { actions: ['clear'] },
                }}
                slots={{
                  toolbar: undefined,
                }}
              />
            </Stack>

            {/* End Date */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.secondary"
                sx={{ minWidth: 70 }}
              >
                End Date
              </Typography>
              <DatePicker
                value={endDate}
                onOpen={() => setIsEndOpen(true)}
                onClose={() => setIsEndOpen(false)}
                onChange={(newValue) => {
                  onSelectEnd(newValue);
                  setIsEndOpen(false);

                  if (startDate) {
                    handleClose();
                  }
                }}
                open={isEndOpen}
                minDate={startDate || undefined}
                slotProps={{
                  textField: {
                    size: 'small',
                    sx: { width: 168 },
                  },
                  actionBar: { actions: ['clear'] },
                }}
                slots={{
                  toolbar: undefined,
                }}
              />
            </Stack>
          </Stack>
        </LocalizationProvider>
      </Menu>
    </Stack>
  );
};
