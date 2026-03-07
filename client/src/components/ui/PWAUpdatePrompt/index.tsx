import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Stack, Typography } from '@mui/material';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '../Button';

export const PWAUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (!needRefresh) return;
    toast(
      (t) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="body2">New version available.</Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              toast.dismiss(t.id);
              updateServiceWorker(true);
            }}
          >
            Reload
          </Button>
        </Stack>
      ),
      { duration: Infinity, id: 'pwa-update' },
    );
  }, [needRefresh, updateServiceWorker]);

  return null;
};
