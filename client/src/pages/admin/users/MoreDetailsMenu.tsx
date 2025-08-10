import { MoreHorizOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, Divider, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

export const MoreDetailsMenu = ({ id }: { id?: string }) => {
  const { tenantId } = useTenantContext();
  const navigate = useNavigate();

  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorElSettingsMenu(e.currentTarget);

  const handleViewDetails = () => {
    navigate(
      pathFor({
        pathname: AdminRoutes.TenantUserDetail,
        params: {
          tenantId,
          userId: id,
        },
      }),
    );
  };
  return (
    <>
      <Button
        onClick={handleOpenMenu}
        size="small"
        variant="outlined"
        sx={{ height: 24, minWidth: 24 }}
      >
        <MoreHorizOutlined fontSize="inherit" />
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
          <Typography>Assign Roles</Typography>
        </MenuItem>
        <MenuItem onClick={() => null}>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
