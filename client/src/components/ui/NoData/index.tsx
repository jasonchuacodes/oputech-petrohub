import { ErrorOutline } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

export const NoData = ({ text = 'No data found.' }: { text: string }) => {
  return (
    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" height="100%">
      <ErrorOutline sx={{ color: 'text.secondary' }} />
      <Typography color="text.secondary" variant="body2">
        {text}
      </Typography>
    </Stack>
  );
};
