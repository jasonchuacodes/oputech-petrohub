import { Stack, type StackProps } from '@mui/material';

export const PageLayout = ({ children, ...props }: StackProps) => {
  return (
    <Stack flex={1} height="100%" bgcolor="background.paper" {...props}>
      {children}
    </Stack>
  );
};
