import { Typography } from '@mui/material';
import { CustomModal } from '~/components/ui';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export const DeleteConfirmModal = ({ open, onClose, onConfirm, loading }: DeleteConfirmModalProps) => {
  return (
    <CustomModal
      onSubmit={onConfirm}
      onClose={onClose}
      open={open}
      type="danger"
      title="Delete User Confirmation"
      submitText="Delete"
      maxWidth={520}
      loading={loading}
    >
      <Typography>Are you sure you want to delete this user?</Typography>
    </CustomModal>
  );
};
