import { ErrorOutline } from '@mui/icons-material';
import { Stack, Typography, type StackProps } from '@mui/material';

export const NoData = ({
  text = 'No data found.',
  sx,
}: {
  text: string;
  sx?: StackProps['sx'];
}) => {
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      alignItems="center"
      height="100%"
      sx={{ ...sx }}
    >
      <ErrorOutline sx={{ color: 'text.secondary' }} />
      <Typography color="text.secondary" variant="body2">
        {text}
      </Typography>
    </Stack>
  );
};
