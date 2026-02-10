import { MoreHorizOutlined } from '@mui/icons-material';
import { Menu, MenuItem, Typography, IconButton, Divider } from '@mui/material';
import { useState } from 'react';

type MoreDetailsMenuProps = {
  payslipId: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const MoreDetailsMenu = ({ payslipId, onView, onEdit, onDelete }: MoreDetailsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleView = () => {
    closeMenu();
    onView();
  };

  const handleEdit = () => {
    closeMenu();
    onEdit();
  };

  const handleDelete = () => {
    closeMenu();
    onDelete();
  };

  return (
    <>
      <IconButton onClick={openMenu} size="small">
        <MoreHorizOutlined fontSize="inherit" sx={{ color: 'text.secondary' }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id={`payslip-menu-${payslipId}`}
        open={isOpen}
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
        <MenuItem onClick={handleView}>
          <Typography variant="body2">View</Typography>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Typography variant="body2">Edit</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <Typography variant="body2" color="error">
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};
