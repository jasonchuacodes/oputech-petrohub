import { Menu, Stack, Typography } from '@mui/material';
import { CalendarTodayOutlined, RestartAltOutlined } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { alpha } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useMemo } from 'react';

import theme from '~/theme';
import { formatRange } from '~/utils/date';

import { RangePickersDay } from './RangePickersDay';
import { Button } from '../Button';

export type DateRange = { start: Dayjs | null; end: Dayjs | null };

type DateRangePicker = {
  label?: string;
  selectedStart: Dayjs | null;
  selectedEnd: Dayjs | null;
  onAccept: (value: DateRange) => void;
};

export const DateRangePicker = ({
  label,
  selectedStart,
  selectedEnd,
  onAccept,
}: DateRangePicker) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const [start, setStart] = useState<Dayjs | null>(selectedStart);
  const [end, setEnd] = useState<Dayjs | null>(selectedEnd);
  const [hoverDay, setHoverDay] = useState<Dayjs | null>(null);
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCancel = () => {
    setStart(selectedStart);
    setEnd(selectedEnd);
    setHoverDay(null);
    setSelectionMode('start');
    handleClose();
  };

  const handleReset = () => {
    setStart(dayjs().weekday(0).startOf('day'));
    setEnd(dayjs().weekday(6).endOf('day'));
    setHoverDay(null);
    setSelectionMode('start');
  };

  const handleDayClick = (day: Dayjs | null) => {
    if (!day) return;

    if (selectionMode === 'start') {
      setStart(day);
      setEnd(null);
      setSelectionMode('end');
      setHoverDay(null);
    } else {
      // Swap if end is before start
      const newStart = day.isBefore(start, 'day') ? day : start;
      const newEnd = day.isBefore(start, 'day') ? start : day;

      setStart(newStart);
      setEnd(newEnd);
      setSelectionMode('start');
      setHoverDay(null);
    }
  };

  const handleDayHover = (day: Dayjs) => {
    if (selectionMode === 'end' && start) {
      setHoverDay(day);
    }
  };

  const handleAccept = () => {
    if (start && end) {
      onAccept({ start, end });
      handleClose();
    }
  };

  // Memoized range checking functions
  const rangeState = useMemo(
    () => ({
      effectiveEnd: selectionMode === 'end' && hoverDay ? hoverDay : end,
    }),
    [end, hoverDay, selectionMode],
  );

  const isInRange = (day: Dayjs) => {
    if (!start || !rangeState.effectiveEnd) return false;
    const dayStart = Math.min(start.unix(), rangeState.effectiveEnd.unix());
    const dayEnd = Math.max(start.unix(), rangeState.effectiveEnd.unix());
    const dayUnix = day.unix();
    return dayUnix > dayStart && dayUnix < dayEnd;
  };

  const isStartDay = (day: Dayjs) => start?.isSame(day, 'day') ?? false;

  const isEndDay = (day: Dayjs) => rangeState.effectiveEnd?.isSame(day, 'day') ?? false;

  const isHoveringDay = (day: Dayjs) => hoverDay?.isSame(day, 'day') ?? false;

  return (
    <Stack direction='row' alignItems="center" spacing={1}>
      <Typography variant="body2" color="text.primary">
        {label ? label : 'Date Period'}:
      </Typography>
      <Button
        onClick={handleOpen}
        variant="outlined"
        sx={{
          width: 'fit-content',
          height: 40,
          justifyContent: 'flex-start',
          bgcolor: isOpen ? alpha(theme.palette.primary.light, 0.1) : 'background.paper',
        }}
        endIcon={
          <CalendarTodayOutlined
            fontSize="small"
            sx={{ ml:2,  color: 'text.secondary' }}
          />
        }
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
              value={selectionMode === 'start' ? start : end}
              onChange={handleDayClick}
              slots={{
                day: RangePickersDay,
              }}
              slotProps={{
                day: (dayProps) => ({
                  ...dayProps,
                  isInRange: isInRange(dayProps.day),
                  isStartOfRange: isStartDay(dayProps.day),
                  isEndOfRange: isEndDay(dayProps.day),
                  isHovering: isHoveringDay(dayProps.day),
                  onMouseEnter: () => handleDayHover(dayProps.day),
                  onMouseLeave: () => setHoverDay(null),
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
