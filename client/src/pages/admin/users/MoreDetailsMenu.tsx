import { MoreHorizOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, Divider } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Button } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useUserContext } from '~/context/user/useUserContext';
import { AdminRoutes } from '~/routes';
import { useDeleteUserMutation } from '~/services/user/user.queries';
import { parseBackendError } from '~/utils/parseBackendError';
import { pathFor } from '~/utils/pathFor';

import { DeleteConfirmModal } from './DeleteConfirmModal';

export const MoreDetailsMenu = () => {
  const navigate = useNavigate();
  const { auth } = useAuthContext();
  const { tenantId } = useTenantContext();
  const { userId } = useUserContext();

  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  const { mutateAsync: deleteUser, isPending: isDeletePending } = useDeleteUserMutation();

  const isDeleteDisabled = auth?.id === userId;

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElSettingsMenu(e.currentTarget);

  const closeMenu = () => setAnchorElSettingsMenu(null);

  const handleViewDetails = () => {
    navigate(
      pathFor({
        pathname: AdminRoutes.TenantUserDetail,
        params: {
          tenantId,
          userId,
        },
      }),
    );
  };

  const handleDelete = () => {
    closeMenu();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!tenantId) return;

    if (auth?.id === userId) {
      toast.error('You cannot delete your own account');
      return;
    }

    try {
      await deleteUser({ userId, tenantId });
      toast.success('Successfully deleted user');
    } catch (err) {
      const parsedErr = parseBackendError(err);
      toast.error(`Failed to delete user: ${parsedErr}`);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={openMenu}
        size="small"
        variant="outlined"
        sx={{ borderColor: 'divider', height: 24, minWidth: 24 }}
      >
        <MoreHorizOutlined fontSize="inherit" sx={{color: 'text.secondary'}}/>
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
          <Typography variant="body2">View Details</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => null}>
          <Typography variant="body2">Assign Roles</Typography>
        </MenuItem>
        <MenuItem disabled={isDeleteDisabled} onClick={handleDelete}>
          <Typography variant="body2">Delete</Typography>
        </MenuItem>
      </Menu>

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        loading={isDeletePending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
