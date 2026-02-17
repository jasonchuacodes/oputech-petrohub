import { Menu, Stack, Typography } from '@mui/material';
import { CalendarTodayOutlined, RestartAltOutlined } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { alpha } from '@mui/material/styles';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

import theme from '~/theme';
import { formatRange, getLastCompletedWeek, getWeekPeriod, type WeekPeriod } from '~/utils/date';

import { WeekPickersDay } from './WeekPickersDay';
import { Button } from '../Button';
import { Show } from '../Show';

type WeekPickerProps = {
  label?: string;
  selectedStart: Dayjs | null;
  selectedEnd: Dayjs | null;
  onAccept: (value: WeekPeriod) => void;
};

export const WeekPicker = ({ label, selectedStart, selectedEnd, onAccept }: WeekPickerProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const [start, setStart] = useState<Dayjs | null>(selectedStart);
  const [end, setEnd] = useState<Dayjs | null>(selectedEnd);
  const [hoverWeekStart, setHoverWeekStart] = useState<Dayjs | null>(null);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setStart(selectedStart);
    setEnd(selectedEnd);
    setHoverWeekStart(null);
    handleClose();
  };

  const handleReset = () => {
    const lastWeek = getLastCompletedWeek();
    setStart(lastWeek.start);
    setEnd(lastWeek.end);
    setHoverWeekStart(null);
  };

  const handleDayClick = (day: Dayjs | null) => {
    if (!day) return;

    const weekPeriod = getWeekPeriod(day);
    setStart(weekPeriod.start);
    setEnd(weekPeriod.end);
    setHoverWeekStart(null);
  };

  const handleDayHover = (day: Dayjs) => {
    const weekPeriod = getWeekPeriod(day);
    setHoverWeekStart(weekPeriod.start);
  };

  const handleAccept = () => {
    if (start && end) {
      onAccept({ start, end });
      handleClose();
    }
  };

  const isInSelectedWeek = (day: Dayjs) => {
    if (!start || !end) return false;
    return day.isBetween(start, end, 'day', '[]');
  };

  const isInHoveredWeek = (day: Dayjs) => {
    if (!hoverWeekStart) return false;
    const hoverWeekEnd = hoverWeekStart.add(6, 'day');
    return day.isBetween(hoverWeekStart, hoverWeekEnd, 'day', '[]');
  };

  const isWeekStart = (day: Dayjs) => day.day() === 0;

  const isWeekEnd = (day: Dayjs) => day.day() === 6;

  return (
    <Stack spacing={0.5}>
      <Show when={!!label}>
        <Typography variant="body2" color="text.primary">
          {label}:
        </Typography>
      </Show>
      <Button
        onClick={handleOpen}
        variant="outlined"
        sx={{
          width: 'fit-content',
          height: 40,
          justifyContent: 'flex-start',
          bgcolor: isOpen ? alpha(theme.palette.primary.light, 0.1) : 'background.paper',
        }}
        endIcon={<CalendarTodayOutlined fontSize="small" sx={{ ml: 2, color: 'text.secondary' }} />}
      >
        <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
          {selectedStart || selectedEnd ? (
            <Typography component="span" variant="body2">
              {formatRange(selectedStart, selectedEnd)}
            </Typography>
          ) : (
            <Typography component="span" variant="body2" color="text.secondary">
              {label}
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
            sx: {
              borderRadius: 1,
            },
          },
          list: {
            sx: {
              py: 0,
            },
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack sx={{ minWidth: 300, maxWidth: 400 }}>
            {/* Calendar */}
            <DateCalendar
              value={start}
              onChange={handleDayClick}
              slots={{
                day: WeekPickersDay,
              }}
              slotProps={{
                day: (dayProps) => ({
                  ...dayProps,
                  isInSelectedWeek: isInSelectedWeek(dayProps.day),
                  isWeekStart: isWeekStart(dayProps.day),
                  isWeekEnd: isWeekEnd(dayProps.day),
                  isHovering: isInHoveredWeek(dayProps.day),
                  onMouseEnter: () => handleDayHover(dayProps.day),
                  onMouseLeave: () => setHoverWeekStart(null),
                }),
              }}
            />

            {/* Form Actions */}
            <Stack direction="row" p={1} spacing={1} justifyContent="space-between">
              <Button
                size="small"
                onClick={handleReset}
                startIcon={<RestartAltOutlined fontSize="inherit" />}
                sx={{ fontWeight: 'medium', borderRadius: 1, px: 1, py: '6px' }}
              >
                Reset
              </Button>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  disableElevation={true}
                  onClick={handleCancel}
                  type="button"
                  variant="text"
                  sx={{ fontWeight: 'medium', borderRadius: 1, px: 1, py: '6px' }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  disabled={!start || !end}
                  type="submit"
                  variant="text"
                  onClick={handleAccept}
                  sx={{ fontWeight: 'medium', borderRadius: 1, px: 1, py: '6px' }}
                >
                  OK
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </LocalizationProvider>
      </Menu>
    </Stack>
  );
};
