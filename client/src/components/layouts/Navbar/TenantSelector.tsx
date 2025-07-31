import { ChevronRight } from '@mui/icons-material';
import { Avatar, Menu, MenuItem, Typography } from '@mui/material';
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
  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  const tenants = auth?.tenants;
  const multipleTenants = tenants && tenants.length > 1;

  const activeTenant = useMemo(() => {
    return tenants?.find((tenant) => tenant.id === tenantId);
  }, [tenants, tenantId]);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElSettingsMenu(e.currentTarget);

  const handleCloseMenu = () => setAnchorElSettingsMenu(null);

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
          {multipleTenants && <ChevronRight fontSize="small" sx={{ transform: 'rotate(90deg)' }} />}
        </Button>
      )}

      {multipleTenants && (
        <Menu
          anchorEl={anchorElSettingsMenu}
          id="settings-menu"
          open={isOpenSettingsMenu}
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
                mt: 0.5,
                minWidth: 180,
              },
            },
          }}
        >
          {tenants?.map(({ name, id }) => {
            return (
              <MenuItem key={id} selected={tenantId === id} onClick={() => handleSelectTenant(id)}>
                <Typography>{name}</Typography>
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </>
  );
};

export default TenantSelector;
