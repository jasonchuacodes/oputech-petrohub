import { Stack, type StackProps } from '@mui/material';
import { Footer } from '~/components/ui';

export const LoginLayout = ({ children, ...props }: StackProps) => {
  return (
    <Stack flex={1}  height="100vh" bgcolor="background.paper" {...props}>
      {/* Decors */}
      {children}
      <Footer />
    </Stack>
  );
};
