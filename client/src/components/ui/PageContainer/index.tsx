import { Container, type ContainerProps, Stack, type StackProps } from '@mui/material';
import type React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: ContainerProps['maxWidth'];
  spacing?: StackProps['spacing'];
  p?: StackProps['p'];
  containerSx?: ContainerProps['sx'];
  stackSx?: StackProps['sx'];
}

export const PageContainer = ({
  children,
  maxWidth = 'lg',
  spacing = 3,
  p = 3,
  containerSx,
  stackSx,
}: PageContainerProps) => {
  return (
    <Container
      maxWidth={maxWidth}
      disableGutters
      sx={{ display: 'flex', flex: 1, ...containerSx }}
    >
      <Stack
        spacing={spacing}
        p={p}
        bgcolor="default"
        flex={1}
        sx={{ height: '100%', minWidth: 0, ...stackSx }}
      >
        {children}
      </Stack>
    </Container>
  );
};
