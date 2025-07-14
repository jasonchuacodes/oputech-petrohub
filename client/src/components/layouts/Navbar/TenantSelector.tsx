import { ChevronRight } from '@mui/icons-material';
import { Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { Button } from '~/components/ui';

const TenantSelector = () => {
  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  return (
    <>
      <Button
        onClick={(e) => setAnchorElSettingsMenu(e.currentTarget)}
        endIcon={<ChevronRight fontSize="small" sx={{ transform: 'rotate(90deg)' }} />}
        variant="outlined"
      >
        My Tenant Name
      </Button>
      <Menu
        anchorEl={anchorElSettingsMenu}
        id="settings-menu"
        open={isOpenSettingsMenu}
        onClose={() => setAnchorElSettingsMenu(null)}
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
              minWidth: 180,
            },
          },
        }}
      >
        <MenuItem selected={true} onClick={() => null}>
          <Typography>My Tenant Name</Typography>
        </MenuItem>
        <MenuItem onClick={() => null}>
          <Typography>Menu item</Typography>
        </MenuItem>
        <MenuItem onClick={() => null}>
          <Typography>Menu item</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default TenantSelector;
