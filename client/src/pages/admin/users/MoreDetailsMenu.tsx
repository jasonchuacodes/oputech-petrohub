import { MoreHorizOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, Divider, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '~/context/auth/useAuthContext';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

export const MoreDetailsMenu = ({
  id,
  onDelete,
}: {
  id: string;
  onDelete: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const { auth } = useAuthContext();
  const { tenantId } = useTenantContext();

  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  const isDeleteDisabled = auth?.id === id;

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElSettingsMenu(e.currentTarget);

  const closeMenu = () => setAnchorElSettingsMenu(null);

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

  const handleDelete = (id: string) => {
    closeMenu();
    onDelete(id);
  };

  return (
    <>
      <Button onClick={openMenu} size="small" variant="outlined" sx={{ height: 24, minWidth: 24 }}>
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
          <Typography>Assign Roles</Typography>
        </MenuItem>
        <MenuItem disabled={isDeleteDisabled} onClick={() => handleDelete(id)}>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
