import { ChevronRightOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { useDashboardContext, type AnalyticsPreset } from '~/context/dashboard';
import { Button } from '~/components/ui';

const presetLabels: Record<AnalyticsPreset, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'This month',
};

export const PresetFilterMenu = () => {
  const { preset, setPreset } = useDashboardContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handlePresetSelect = (selectedPreset: AnalyticsPreset) => {
    setPreset(selectedPreset);
    closeMenu();
  };

  return (
    <>
      <Button
        onClick={openMenu}
        variant="outlined"
        endIcon={
          <ChevronRightOutlined sx={{ color: 'text.secondary', transform: 'rotate(90deg)' }} />
        }
      >
        <Typography variant="body2">{presetLabels[preset]}</Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 0.5,
              minWidth: 140,
            },
          },
        }}
      >
        <MenuItem onClick={() => handlePresetSelect('daily')}>
          <Typography variant="body2">Daily</Typography>
        </MenuItem>
        <MenuItem onClick={() => handlePresetSelect('weekly')}>
          <Typography variant="body2">Weekly</Typography>
        </MenuItem>
        <MenuItem onClick={() => handlePresetSelect('monthly')}>
          <Typography variant="body2">Monthly</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
