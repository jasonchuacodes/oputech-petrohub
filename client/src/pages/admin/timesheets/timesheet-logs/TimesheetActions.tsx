import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useTimesheetLogContext } from '~/context/timesheetLog';
import { useDeleteTimesheetMutation } from '~/services/timesheet/timesheet.queries';
import { parseBackendError } from '~/utils/parseBackendError';

import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EditTimesheetModal } from './EditTimesheetModal';

export const TimesheetActions = () => {
  const { timesheetLog } = useTimesheetLogContext();
  const { tenantId } = useTenantContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { mutateAsync: deleteTimesheet, isPending: isDeletePending } =
    useDeleteTimesheetMutation();

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTimesheet({ timesheetId: timesheetLog.id, tenantId });
      toast.success('Successfully deleted timesheet');
    } catch (err) {
      const parsedErr = parseBackendError(err);
      toast.error(`Failed to delete timesheet: ${parsedErr}`);
    } finally {
      setIsDeleteModalOpen(false);
    }
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

      <EditTimesheetModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        timesheet={timesheetLog}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        loading={isDeletePending}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
