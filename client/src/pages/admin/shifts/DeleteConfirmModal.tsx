import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { Button } from '~/components/ui';

type DeleteConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  shiftName: string;
  userCount: number;
};

export const DeleteConfirmModal = ({
  open,
  onClose,
  onConfirm,
  shiftName,
  userCount,
}: DeleteConfirmModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Shift</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{shiftName}</strong>?
        </Typography>
        {userCount > 0 && (
          <Typography color="warning.main" sx={{ mt: 2 }}>
            This will unassign {userCount} user{userCount !== 1 ? 's' : ''} from this shift.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
