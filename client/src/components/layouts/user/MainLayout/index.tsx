import { Box, Stack, type StackProps } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Navbar from '../Navbar';

export const UserMainLayout = ({ ...props }: StackProps) => {
  return (
    <Stack height="100dvh" width="100%" bgcolor="background">
      <Navbar />
      <Box flex={1} minHeight={0} overflow="auto" {...props}>
        <Outlet />
      </Box>
    </Stack>
  );
};
