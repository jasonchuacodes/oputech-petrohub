import { Stack, Typography } from '@mui/material';

interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ title, description, action }: Props) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      mb={3}
      gap={1}
    >
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Stack>
      {action}
    </Stack>
  );
};
