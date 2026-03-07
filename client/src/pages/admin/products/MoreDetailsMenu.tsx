import { MoreHorizOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, IconButton } from '@mui/material';
import { useState } from 'react';

import { useDisclosure } from '~/hooks/useDisclosure';

import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EditProductModal } from './EditProductModal';

export const MoreDetailsMenu = () => {
  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const editDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const isOpenSettingsMenu = Boolean(anchorElSettingsMenu);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElSettingsMenu(e.currentTarget);
  const closeMenu = () => setAnchorElSettingsMenu(null);

  const handleEdit = () => {
    closeMenu();
    editDisclosure.onOpen();
  };

  const handleDelete = () => {
    closeMenu();
    deleteDisclosure.onOpen();
  };

  return (
    <>
      <IconButton onClick={openMenu} size="small">
        <MoreHorizOutlined fontSize="inherit" sx={{ color: 'text.secondary' }} />
      </IconButton>

      <Menu
        anchorEl={anchorElSettingsMenu}
        id="settings-menu"
        open={isOpenSettingsMenu}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
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
        <MenuItem onClick={handleEdit}>
          <Typography variant="body2">Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Typography variant="body2">Delete</Typography>
        </MenuItem>
      </Menu>

        <EditProductModal open={editDisclosure.open} onClose={editDisclosure.onClose} />
        <DeleteConfirmModal open={deleteDisclosure.open} onClose={deleteDisclosure.onClose} />

    </>
  );
};
