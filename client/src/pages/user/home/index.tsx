import { Stack, Typography } from '@mui/material';

import NavbarUserMenu from '~/components/layouts/Navbar/NavbarUserMenu';

export const HomePage = () => {
  return (
    <Stack width="100%">
      <Typography>User Home Page</Typography>
      <NavbarUserMenu />
    </Stack>
  );
};
