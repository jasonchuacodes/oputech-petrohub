import { Avatar, Divider, IconButton, Stack } from '@mui/material';
import { NotificationsOutlined, SettingsOutlined } from '@mui/icons-material';

import NavbarUserMenu from './NavbarUserMenu';
import TenantSelector from './TenantSelector';

const Navbar = () => {
  return (
    <Stack direction="row" justifyContent="space-between" p={1} bgcolor="background.paper">
      <Stack direction="row" alignItems="center" spacing={1}>
        {/* Organization Initials */}
        <Avatar sx={{ bgcolor: 'primary.main' }} variant="rounded">
          B
        </Avatar>
        <TenantSelector />
      </Stack>
      <Stack
        direction="row"
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
        <Stack direction="row">
          <IconButton>
            <SettingsOutlined fontSize='small'/>
          </IconButton>
          <IconButton>
            <NotificationsOutlined fontSize='small'/>
          </IconButton>
        </Stack>
        <NavbarUserMenu />
      </Stack>
    </Stack>
  );
};

export default Navbar;
