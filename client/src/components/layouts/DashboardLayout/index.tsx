import { Stack, type StackProps } from '@mui/material';

import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = ({ ...props }: StackProps) => {
  return (
    <Stack direction="column" height="100vh" width="100%" bgcolor="background" {...props}>
      <Navbar />
      <Stack direction="row" flex={1}>
        <Sidebar />
        <Outlet />
      </Stack>
    </Stack>
  );
};
