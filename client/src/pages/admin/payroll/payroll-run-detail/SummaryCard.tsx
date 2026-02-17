import { Stack, Typography } from '@mui/material';

export const SummaryCard = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Stack
    flex={1}
    p={2}
    spacing={1}
    borderRadius={2}
    border="1px solid"
    borderColor="divider"
    bgcolor="background.paper"
  >
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    {children}
  </Stack>
);
