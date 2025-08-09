import { Box, Stack, type StackProps } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from '../Sidebar';

export const UserMainLayout = ({ ...props }: StackProps) => {
  return (
    <Stack direction="column" height="100vh" width="100%" bgcolor="background" {...props}>
      <Sidebar />
      <Box flex={1} overflow="auto">
        <Outlet />
      </Box>
    </Stack>
  );
};
