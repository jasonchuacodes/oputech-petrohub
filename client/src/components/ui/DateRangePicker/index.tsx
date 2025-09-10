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
import { formatRange } from '~/utils/dateUtils';

export type DateRange = { start: Dayjs | null; end: Dayjs | null };

type DateRangePickerProps = {
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
}: DateRangePickerProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const [start, setStart] = useState<Dayjs | null>(selectedStart);
  const [end, setEnd] = useState<Dayjs | null>(selectedEnd);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleCancel = () => {
    setStart(selectedStart);
    setEnd(selectedEnd);
    handleClose();
  };
  const handleAccept = () => {
    onAccept({ start: start, end: end });
    handleClose();
  };

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

          {selectedStart || selectedEnd ? (
            <Typography component="span">{formatRange(selectedStart, selectedEnd)}</Typography>
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
                value={start}
                onOpen={() => setIsStartOpen(true)}
                onClose={() => setIsStartOpen(false)}
                onChange={(newValue) => {
                  setStart(newValue);
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
                value={end}
                onOpen={() => setIsEndOpen(true)}
                onClose={() => setIsEndOpen(false)}
                onChange={(newValue) => {
                  setEnd(newValue);
                  setIsEndOpen(false);
                }}
                open={isEndOpen}
                minDate={selectedStart || undefined}
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

            {/* Form Actions */}
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                disableElevation={true}
                onClick={handleCancel}
                type="button"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                disabled={!start || !end}
                type="submit"
                variant="contained"
                onClick={handleAccept}
                color="primary"
              >
                OK
              </Button>
            </Stack>
          </Stack>
        </LocalizationProvider>
      </Menu>
    </Stack>
  );
};
