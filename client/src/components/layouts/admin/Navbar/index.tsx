import { Avatar, Divider, Stack, Typography } from '@mui/material';

import { NotificationMenu } from './NotificationMenu';
import NavbarUserMenu from './UserMenu';

const Navbar = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      p={1}
      alignItems="center"
      bgcolor="background.paper"
      borderBottom={1}
      borderColor="divider"
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Avatar
          variant="rounded"
          sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: 'common.white' }}
        >
          P
        </Avatar>
        <Typography variant="body1" color="text.primary" fontWeight={600}>
          PETROMATE
        </Typography>
      </Stack>
      <Stack
        direction="row"
        marginLeft="auto"
        alignItems="center"
        spacing={1.5}
        divider={
          <Divider
            flexItem={true}
            orientation="vertical"
            sx={{
              height: 20,
              width: 2,
              borderRadius: 1,
              bgcolor: 'divider',
              alignSelf: 'center',
            }}
          />
        }
      >
        <NotificationMenu />
        <NavbarUserMenu />
      </Stack>
    </Stack>
  );
};

export default Navbar;
