import { Stack, type StackProps } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Navbar from '../Navbar';

export const SetupLayout = ({ ...props }: StackProps) => {
  return (
    <Stack height="100vh" bgcolor='background' {...props}>
      <Navbar />
      <Outlet />
    </Stack>
  );
};
