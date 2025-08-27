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

export const DateRangePicker = ({ label }: { label?: string }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
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
        {startDate && endDate
          ? `${startDate.format('MMM D, YYYY')} - ${endDate.format('MMM D, YYYY')}`
          : label}
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
                  setStartDate(newValue);
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
                  setEndDate(newValue);
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
