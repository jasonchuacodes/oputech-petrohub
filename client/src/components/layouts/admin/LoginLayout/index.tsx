import { Stack, type StackProps } from '@mui/material';
import { Footer } from '~/components/ui';

export const LoginLayout = ({ children, ...props }: StackProps) => {
  return (
    <Stack height="100dvh">
      <Stack flex={1} minHeight={0} overflow='auto' bgcolor="background.paper" {...props}>
        {/* Decors */}
        {children}
        <Footer />
      </Stack>
    </Stack>
  );
};
