import { Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useTimesheetLogContext } from '~/context/timesheetLog';
import { useDeleteTimesheetMutation } from '~/services/timesheet/timesheet.queries';
import { parseBackendError } from '~/utils/parseBackendError';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
};

export const DeleteConfirmModal = ({ open, onClose }: DeleteConfirmModalProps) => {
  const { tenantId } = useTenantContext();
  const { timesheetLog } = useTimesheetLogContext();

  const { mutateAsync: deleteTimesheet, isPending: isDeletePending } = useDeleteTimesheetMutation();

  const handleConfirmDelete = async () => {
    try {
      await deleteTimesheet({ timesheetId: timesheetLog.id, tenantId });
      toast.success('Successfully deleted timesheet');
    } catch (err) {
      const parsedErr = parseBackendError(err);
      toast.error(`Failed to delete timesheet: ${parsedErr}`);
    } finally {
      onClose();
    }
  };

  return (
    <CustomModal
      onSubmit={handleConfirmDelete}
      onClose={onClose}
      open={open}
      type="danger"
      title="Delete Timesheet Confirmation"
      submitText="Delete"
      maxWidth={400}
      loading={isDeletePending}
    >
      <Typography variant="body2">
        Are you sure you want to delete this timesheet? All associated entries will be permanently
        deleted.
      </Typography>
    </CustomModal>
  );
};
