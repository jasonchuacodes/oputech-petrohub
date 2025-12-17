import { Stack, Typography } from '@mui/material';

interface Props {
  title: string;
  description?: string;
}

export const PageHeader = ({ title, description }: Props) => {
  return (
    <Stack spacing={0.5}>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Stack>
  );
};
