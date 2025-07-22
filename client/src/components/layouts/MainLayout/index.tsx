import { Box, Stack, type StackProps } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

export const MainLayout = ({ ...props }: StackProps) => {
  return (
    <Stack direction="column" height="100vh" width="100%" bgcolor="background" {...props}>
      <Box position="sticky" top={0} zIndex={1100} bgcolor="background.paper">
        <Navbar />
      </Box>
      <Stack direction="row" flex={1} overflow="hidden">
        <Sidebar />
        <Box flex={1} overflow="auto">
          <Outlet />
        </Box>
      </Stack>
    </Stack>
  );
};
