import { Typography } from '@mui/material';

import { CustomModal } from '~/components/ui';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  loading,
}: DeleteConfirmModalProps) => {
  return (
    <CustomModal
      onSubmit={onConfirm}
      onClose={onClose}
      open={open}
      type="danger"
      title="Delete Timesheet Confirmation"
      submitText="Delete"
      maxWidth={400}
      loading={loading}
    >
      <Typography variant='body2'>
        Are you sure you want to delete this timesheet? All associated entries will be permanently
        deleted.
      </Typography>
    </CustomModal>
  );
};
