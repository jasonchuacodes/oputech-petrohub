import {
  AddBoxOutlined,
  CachedOutlined,
  ChevronLeftOutlined,
  ChevronRight,
  SettingsOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { useGetTenantsQuery } from '~/services/tenant/tenant.queries';
import { pathFor } from '~/utils/pathFor';

const TenantSelector = () => {
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();

  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const [viewTenants, setViewTenants] = useState(false);

  const isOpenMenu = Boolean(anchorElSettingsMenu);

  const { data: tenants, isLoading: isLoadingTenants } = useGetTenantsQuery();

  const activeTenant = useMemo(() => {
    return tenants?.find((tenant) => tenant.id === tenantId);
  }, [tenants, tenantId]);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElSettingsMenu(e.currentTarget);

  const handleCloseMenu = () => {
    setAnchorElSettingsMenu(null);
    setViewTenants(false);
  };

  const handleCreateTenant = () => {
    navigate(
      pathFor({
        pathname: AdminRoutes.TenantCreate,
        params: {
          tenantId,
        },
      }),
    );
    handleCloseMenu();
  };

  const handleSettings = () => {
     navigate(
      pathFor({
        pathname: AdminRoutes.TenantSettings,
        params: {
          tenantId,
        },
      }),
    );
    handleCloseMenu();
  }

  const handleSelectTenant = (id: string) => {
    navigate(
      pathFor({
        pathname: AdminRoutes.TenantHome,
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
        {viewTenants ? (
          <Stack maxHeight={240} spacing={1}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              position="relative"
              p={1}
              flexShrink={0}
            >
              <IconButton
                size="small"
                sx={{ position: 'absolute', left: 0 }}
                onClick={() => setViewTenants(false)}
              >
                <ChevronLeftOutlined fontSize="inherit" />
              </IconButton>
              <Typography fontWeight="bold">Select Tenant</Typography>
            </Stack>
            {isLoadingTenants ? (
              <Stack spacing={0.5}>
                {Array.from({ length: 3 }).map((_, index) => {
                  return <Skeleton key={index} height={40} variant="rounded" />;
                })}
              </Stack>
            ) : (
              <Stack flex={1} overflow="auto">
                {tenants?.map(({ id, name }) => {
                  return (
                    <MenuItem
                      selected={id === tenantId}
                      key={id}
                      onClick={() => handleSelectTenant(id)}
                      sx={{ borderRadius: 1 }}
                    >
                      <Typography fontWeight={id === tenantId ? 'bold' : 'normal'}>
                        {name}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Stack>
            )}
          </Stack>
        ) : (
          <MenuList
            sx={{
              '& .MuiMenuItem-root': {
                borderRadius: 1,
              },
            }}
          >
            <Stack px={2} py={1}>
              <Typography fontWeight="bold">{activeTenant?.name}</Typography>
            </Stack>
            <Divider sx={{ my: 1 }} />
            <MenuItem
              disabled={tenants && tenants?.length <= 1}
              onClick={() => setViewTenants(true)}
            >
              <ListItemIcon>
                <CachedOutlined fontSize="small" />
              </ListItemIcon>
              <Typography>Switch Tenant</Typography>
            </MenuItem>
            <MenuItem onClick={handleCreateTenant}>
              <ListItemIcon>
                <AddBoxOutlined fontSize="small" />
              </ListItemIcon>
              <Typography>Create tenant</Typography>
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <SettingsOutlined fontSize="small" />
              </ListItemIcon>
              <Typography>Settings</Typography>
            </MenuItem>
          </MenuList>
        )}
      </Menu>
    </>
  );
};

export default TenantSelector;
