import { Typography } from '@mui/material';

export const NoData = ({ text = 'No data found.' }: { text: string }) => {
  return (
    <Typography color="text.secondary" variant="body2">
      {text}
    </Typography>
  );
};
