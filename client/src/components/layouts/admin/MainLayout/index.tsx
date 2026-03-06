import { Box, Stack, useMediaQuery, useTheme, type StackProps } from '@mui/material';
import { Outlet } from 'react-router-dom';

import { useDisclosure } from '~/hooks/useDisclosure';

import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

export const AdminMainLayout = ({ ...props }: StackProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const disclosure = useDisclosure(
    isMobile ? false : localStorage.getItem('sidebar:open') !== 'false',
  );

  return (
    <Stack direction="column" height="100vh" width="100%" bgcolor="background" {...props}>
      <Box position="sticky" top={0} zIndex={1100} bgcolor="background.paper">
        <Navbar onMenuOpen={disclosure.onOpen} />
      </Box>
      <Stack direction="row" flex={1} overflow="hidden">
        <Sidebar open={disclosure.open} setOpen={disclosure.setOpen} isMobile={isMobile} />
        <Box flex={1} overflow="auto">
          <Outlet />
        </Box>
      </Stack>
    </Stack>
  );
};
