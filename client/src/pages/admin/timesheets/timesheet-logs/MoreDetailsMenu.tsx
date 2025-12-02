import { MoreHorizOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, Divider, Button } from '@mui/material';
import { useState } from 'react';

export const MoreDetailsMenu = ({ id }: { id: string }) => {
  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElSettingsMenu(e.currentTarget);

  const closeMenu = () => setAnchorElSettingsMenu(null);

  const handleViewDetails = () => console.log('Timesheet ID: ', id);

  return (
    <>
      <Button onClick={openMenu} size="small" variant="text" sx={{ height: 24, minWidth: 24 }}>
        <MoreHorizOutlined fontSize="inherit" />
      </Button>
      <Menu
        anchorEl={anchorElSettingsMenu}
        id="settings-menu"
        open={isOpenSettingsMenu}
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
        <MenuItem onClick={handleViewDetails}>
          <Typography>View Details</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => null}>
          <Typography>Edit</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
