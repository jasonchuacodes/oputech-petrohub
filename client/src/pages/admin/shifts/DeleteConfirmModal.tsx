import { DeleteOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { useShiftContext } from '~/context/shift';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDeleteShiftMutation } from '~/services/shift/shift.queries';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
};

export const DeleteConfirmModal = ({ open, onClose }: DeleteConfirmModalProps) => {
  const { shift } = useShiftContext();
  const { tenantId } = useTenantContext();

  const { mutateAsync: deleteShift } = useDeleteShiftMutation();

  const handleConfirmDelete = async () => {
    if (!tenantId) return;

    try {
      await deleteShift({ shiftId: shift.id, tenantId });
      toast.success('Shift deleted successfully');
      onClose();
    } catch {
      toast.error('Failed to delete shift');
    }
  };

  return (
    <CustomModal
      onSubmit={handleConfirmDelete}
      onClose={onClose}
      open={open}
      type="danger"
      title="Delete Shift Confirmation"
      subheader={
        <Stack spacing={1}>
          <Typography variant="body2">
            Are you sure you want to delete{' '}
            <Typography variant="inherit" component="span" color="warning.main">
              {shift.name}
            </Typography>
            ?
          </Typography>
          {(shift._count?.users || 0) > 0 && (
            <Typography variant="body2">
              This will unassign{' '}
              <Typography variant="inherit" component="span" color="warning.main">
                {shift._count?.users} user{shift._count?.users !== 1 ? 's' : ''}
              </Typography>{' '}
              from this shift.
            </Typography>
          )}
        </Stack>
      }
      submitText="Delete"
      maxWidth={560}
      icon={DeleteOutlined}
    />
  );
};
