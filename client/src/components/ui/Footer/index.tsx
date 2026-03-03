import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

export const Footer = () => {
  const version = import.meta.env.VITE_APP_VERSION || '0.0.0';

  return (
    <Stack component="footer" alignItems="center" justifyContent="center" spacing={1} py={2}>
      <Typography variant="caption" color="text.disabled">
        © {dayjs().year()} Petromate {version}. All rights reserved.
      </Typography>
    </Stack>
  );
};
