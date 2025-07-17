import { IconButton, Avatar, Menu, MenuItem, Typography, Divider } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '~/context/auth/useAuthContext';
import { useLogoutMutation } from '~/services/auth/auth.queries';

const NavbarUserMenu = () => {
  const { auth } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: logout } = useLogoutMutation();

  const userInitials = auth ? auth.username?.split('')[0].toUpperCase() : 'U';

  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.setQueryData(['auth'], null);
      },
      onSettled: () => {
        navigate('/login');
      },
    });
  };

  return (
    <>
      <IconButton
        sx={{ width: 36, height: 36 }}
        onClick={(e) => setAnchorElSettingsMenu(e.currentTarget)}
      >
        <Avatar alt="profile-picture" sx={{ width: 24, height: 24 }}>
          <Typography fontSize="small">{userInitials}</Typography>
        </Avatar>
      </IconButton>
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
              minWidth: 140,
            },
          },
        }}
      >
        <MenuItem onClick={() => null}>
          <Typography>Settings</Typography>
        </MenuItem>
        <MenuItem onClick={() => null}>
          <Typography>Help </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default NavbarUserMenu;
