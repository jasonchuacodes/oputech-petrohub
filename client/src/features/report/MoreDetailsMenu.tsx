import { DeleteOutlineOutlined, MoreVertOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, IconButton, ListItemIcon } from '@mui/material';
import { useState } from 'react';

interface MoreDetailsMenuProps {
  onDelete: () => void;
}

export const MoreDetailsMenu = ({ onDelete }: MoreDetailsMenuProps) => {
  const [anchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
  const isOpenMenu = Boolean(anchorElMenu);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorElMenu(e.currentTarget);
  const closeMenu = () => setAnchorElMenu(null);

  const handleDelete = () => {
    closeMenu();
    onDelete();
  };

  return (
    <>
      <IconButton onClick={openMenu} size="small">
        <MoreVertOutlined sx={{ color: 'common.white' }} />
      </IconButton>

      <Menu
        anchorEl={anchorElMenu}
        id="report-menu"
        open={isOpenMenu}
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
          list: {
            sx: {
              py: 0,
            },
          },
          paper: {
            elevation: 4,
            sx: {
              mt: 0.5,
              minWidth: 140,
            },
          },
        }}
      >
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteOutlineOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2" color="error">
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
