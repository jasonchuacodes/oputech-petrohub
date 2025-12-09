import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { useState } from 'react';

import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EditTimesheetModal } from './EditTimesheetModal';

export const TimesheetActions = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <Stack direction="row" spacing={0.5}>
        <IconButton onClick={handleEdit} size="small">
          <EditOutlined fontSize="inherit" />
        </IconButton>
        <IconButton onClick={handleDelete} size="small">
          <DeleteOutlineOutlined fontSize="inherit" />
        </IconButton>
      </Stack>

      <EditTimesheetModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      <DeleteConfirmModal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} />
    </>
  );
};
