import { Stack, type StackProps } from '@mui/material';

export const PageLayout = ({ children, ...props }: StackProps) => {
  return (
    <Stack direction='row' height="100vh" bgcolor='background' {...props}>
      {children}
    </Stack>
  );
};
