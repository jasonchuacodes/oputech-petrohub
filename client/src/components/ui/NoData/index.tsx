import { ErrorOutline } from '@mui/icons-material';
import { Stack, Typography, type StackProps } from '@mui/material';

export const NoData = ({
  text = 'No records found',
  description = 'Sorry, there are no records found. Please adjust your filters or refresh the page and try again.',
  sx,
}: {
  text: string;
  description?: string;
  sx?: StackProps['sx'];
}) => {
  return (
    <Stack justifyContent="center" alignItems="center" spacing={1} p={2}>
      <Stack
        justifyContent="center"
        alignItems="center"
        border="1px solid"
        borderColor="divider"
        p={1.5}
        borderRadius={2}
      >
        <ErrorOutline fontSize="medium" sx={{ color: 'text.secondary' }} />
      </Stack>
      <Stack spacing={1} justifyContent="center" alignItems="center" height="100%" width={400} sx={{ ...sx }}>
        <Typography color="text.primary" variant="body1" fontWeight={600}>
          {text}
        </Typography>
        <Typography textAlign="center" color="text.secondary" variant="body2">
          {description}
        </Typography>
      </Stack>
    </Stack>
  );
};
