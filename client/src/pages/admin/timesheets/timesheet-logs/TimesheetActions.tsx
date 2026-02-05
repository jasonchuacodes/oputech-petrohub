import { MoreHorizOutlined } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

import { useDisclosure } from '~/hooks/useDisclosure';

import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EditTimesheetModal } from './EditTimesheetModal';
import { ViewTimesheetModal } from './ViewTimesheetModal';

export const TimesheetActions = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const viewDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const isOpenMenu = Boolean(anchorEl);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const handleView = () => {
    closeMenu();
    viewDisclosure.onOpen();
  };

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
        anchorEl={anchorEl}
        id="timesheet-actions-menu"
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
        <MenuItem onClick={handleDelete}>
          <Typography variant="body2">Delete</Typography>
        </MenuItem>
      </Menu>

      <ViewTimesheetModal open={viewDisclosure.open} onClose={viewDisclosure.onClose} />
      <EditTimesheetModal open={editDisclosure.open} onClose={editDisclosure.onClose} />
      <DeleteConfirmModal open={deleteDisclosure.open} onClose={deleteDisclosure.onClose} />
    </>
  );
};
