import { AddBoxOutlined, ChevronRight, SettingsOutlined } from '@mui/icons-material';
import { Avatar, Box, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { Routes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

const TenantSelector = () => {
  const navigate = useNavigate();
  const { auth } = useAuthContext();
  const { tenantId } = useTenantContext();

  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const isOpenMenu = Boolean(anchorElSettingsMenu);

  const tenants = auth?.tenants;

  const activeTenant = useMemo(() => {
    return tenants?.find((tenant) => tenant.id === tenantId);
  }, [tenants, tenantId]);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElSettingsMenu(e.currentTarget);

  const handleCloseMenu = () => setAnchorElSettingsMenu(null);

  const handleCreateTenant = () => {
    navigate(
      pathFor({
        pathname: Routes.TenantCreate,
        params: {
          tenantId,
        },
      }),
    );
    handleCloseMenu();
  };

  const handleSelectTenant = (id: string) => {
    navigate(
      pathFor({
        pathname: Routes.TenantHome,
        params: {
          tenantId: id,
        },
      }),
    );
    handleCloseMenu();
  };

  return (
    <>
      {activeTenant && (
        <Button onClick={handleOpenMenu} sx={{ height: 40, gap: 1, alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} variant="rounded">
            {activeTenant?.name?.charAt(0)}
          </Avatar>
          <Typography>{activeTenant?.name}</Typography>
          <ChevronRight fontSize="small" sx={{ transform: 'rotate(90deg)' }} />
        </Button>
      )}

      <Menu
        anchorEl={anchorElSettingsMenu}
        id="tenant-menu"
        open={isOpenMenu}
        onClose={handleCloseMenu}
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
              px: 2,
              py: 1,
              mt: 0.5,
              minWidth: 240,
            },
          },
        }}
      >
        {tenants?.map(({ name, id }) => {
          if (id === tenantId)
            return (
              <Box key={id} sx={{ display: 'flex', px: 2, py: 1 }}>
                <Typography fontWeight="bold">{name}</Typography>
              </Box>
            );

          return (
            <MenuItem key={id} onClick={() => handleSelectTenant(id)}>
              <Typography>{name}</Typography>
            </MenuItem>
          );
        })}
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleCreateTenant}>
          <ListItemIcon>
            <AddBoxOutlined fontSize="small" />
          </ListItemIcon>
          <Typography>Create tenant</Typography>
        </MenuItem>
        <MenuItem onClick={() => null}>
          <ListItemIcon>
            <SettingsOutlined fontSize="small" />
          </ListItemIcon>
          <Typography>Settings</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default TenantSelector;
