import { IconButton, Avatar, Menu, MenuItem, Typography, Divider } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '~/context/auth/useAuthContext';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { pathFor } from '~/utils/pathFor';
import { AdminRoutes } from '~/routes';

const UserMenu = () => {
  const { auth, logout } = useAuthContext();
  const { tenantId } = useTenantContext();
  const navigate = useNavigate();

  const userInitials = auth ? auth.username?.split('')[0].toUpperCase() : 'U';

  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  return (
    <>
      <IconButton
        sx={{ width: 40, height: 40 }}
        onClick={(e) => setAnchorElSettingsMenu(e.currentTarget)}
      >
        <Avatar alt="profile-picture" sx={{ width: 28, height: 28 }}>
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
        <MenuItem
          disabled={!tenantId}
          onClick={() => {
            setAnchorElSettingsMenu(null);
            navigate(
              pathFor({
                pathname: AdminRoutes.TenantAccountSettings,
                params: { tenantId },
              }),
            );
          }}
        >
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <MenuItem disabled onClick={() => null}>
          <Typography variant="body2">Help </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
