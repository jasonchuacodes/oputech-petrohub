import { Divider, IconButton, Stack } from '@mui/material';
import { NotificationsOutlined, SettingsOutlined } from '@mui/icons-material';

import NavbarUserMenu from './NavbarUserMenu';
import TenantSelector from './TenantSelector';

const Navbar = () => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      p={1}
      bgcolor="background.paper"
      borderBottom={1}
      borderColor="divider"
    >
      <TenantSelector /> 
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
        <Stack direction="row">
          <IconButton>
            <SettingsOutlined />
          </IconButton>
          <IconButton>
            <NotificationsOutlined />
          </IconButton>
        </Stack>
        <NavbarUserMenu />
      </Stack>
    </Stack>
  );
};

export default Navbar;
