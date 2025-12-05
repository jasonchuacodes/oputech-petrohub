import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

type InactivityWarningDialogProps = {
  open: boolean;
  remainingSeconds: number;
  onStayLoggedIn: () => void;
};

export const InactivityWarning = ({
  open,
  remainingSeconds,
  onStayLoggedIn,
}: InactivityWarningDialogProps) => {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={(_, reason) => {
        if (reason === 'backdropClick') return;
      }}
      aria-labelledby="inactivity-dialog-title"
      aria-describedby="inactivity-dialog-description"
    >
      <DialogTitle id="inactivity-dialog-title">Session Expiring Soon</DialogTitle>
      <DialogContent id="inactivity-dialog-description">
        <Typography>
          You will be logged out in {remainingSeconds} second{remainingSeconds !== 1 ? 's' : ''} due to
          inactivity.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onStayLoggedIn} variant="contained" autoFocus>
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};
