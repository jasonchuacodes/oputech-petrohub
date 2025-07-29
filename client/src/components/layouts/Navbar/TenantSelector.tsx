import { ChevronRight } from '@mui/icons-material';
import { Menu, MenuItem, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, LoadingSpinner } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { Routes } from '~/routes';
import { useGetTenantsQuery } from '~/services/tenant/tenant.queries';
import { pathFor } from '~/utils/pathFor';

const TenantSelector = () => {
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();

  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  const { data: tenants, isLoading } = useGetTenantsQuery();

  const multipleTenants = tenants && tenants.length > 1;

  const activeTenantName = useMemo(() => {
    const activeTenant = tenants?.find((tenant) => tenant.id === tenantId);

    return activeTenant?.name ?? 'Select Tenant';
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
      <Button
        onClick={handleOpenMenu}
        endIcon={
          tenants &&
          tenants.length > 1 && (
            <ChevronRight fontSize="small" sx={{ transform: 'rotate(90deg)' }} />
          )
        }
        sx={{ height: 40 }}
        variant="outlined"
      >
        {isLoading ? <LoadingSpinner size="md" /> : activeTenantName}
      </Button>
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
