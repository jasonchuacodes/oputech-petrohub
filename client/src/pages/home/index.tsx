import { Stack, Typography } from '@mui/material';

import Navbar from '~/components/layouts/Navbar';

export const Home = () => {
  return (
    <Stack width="100%">
      <Navbar />
      <Typography>Home Page</Typography>
    </Stack>
  );
};
