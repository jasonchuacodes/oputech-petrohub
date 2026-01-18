import { Box, Stack, type StackProps } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Navbar from '../Navbar';

export const UserMainLayout = ({ ...props }: StackProps) => {
  return (
    <Stack direction="column" height="100vh" width="100%" bgcolor="background.paper" {...props}>
      <Navbar />
      <Box flex={1} overflow="auto">
        <Outlet />
      </Box>
    </Stack>
  );
};
