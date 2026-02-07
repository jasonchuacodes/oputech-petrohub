import { DeleteOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { CustomModal } from '~/components/ui';
import type { User } from '~/services/user/user.types';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  user?: User;
};

export const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  user,
}: DeleteConfirmModalProps) => {
  return (
    <CustomModal
      onSubmit={onConfirm}
      onClose={onClose}
      open={open}
      type="danger"
      title="Delete User"
      subheader={
        <>
          <Typography variant="body2">
            You are about to delete the account of{' '}
            <Typography variant="inherit" component="span" color="warning.main">
              {user?.name}.
            </Typography>
          </Typography>
          <Typography variant="body2">This action is irreversible. Are you sure?</Typography>
        </>
      }
      submitText="Delete"
      loading={loading}
      icon={DeleteOutlined}
    />
  );
};
