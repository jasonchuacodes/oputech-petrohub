import {
  CalendarTodayOutlined,
  CloseOutlined,
  DashboardOutlined,
  MenuOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useState, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { UserRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

import UserMenu from '../UserMenu';

export type NavItem = {
  label: string;
  icon: ComponentType;
  to: string;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { auth } = useAuthContext();

  const [open, setOpen] = useState(false);

  const currentTenant = auth?.tenants[0];
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: DashboardOutlined,
      to: pathFor({
        pathname: UserRoutes.Home,
      }),
    },
    {
      label: 'Timesheets',
      icon: CalendarTodayOutlined,
      to: pathFor({
        pathname: UserRoutes.Home,
      }),
    },
  ];

  const handleNavigate = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 240,
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" height={56} px={1}>
        <Button onClick={() => handleNavigate(pathFor({ pathname: UserRoutes.Home }))}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }} variant="rounded">
            <Typography>{currentTenant?.name.charAt(0).toUpperCase()}</Typography>
          </Avatar>
        </Button>
        <IconButton onClick={() => setOpen(false)}>
          <CloseOutlined />
        </IconButton>
      </Stack>

      <Box flex={1}>
        <List>
          {navItems.map(({ icon, to, label }, index) => (
            <ListItem key={index} disablePadding sx={{ height: 40 }}>
              <ListItemButton
                onClick={() => handleNavigate(to)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mx: 1,
                  px: 1,
                  gap: 1,
                  height: '100%',
                  borderRadius: 1,
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 0 }}>
                  <Icon component={icon} fontSize="small" />
                </ListItemIcon>
                <ListItemText>{label}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <UserMenu />
    </Box>
  );

  return (
    <>
      {/* Navbar */}
      <Stack
        position="relative"
        alignItems="center"
        justifyContent="center"
        height={56}
        border="1px solid"
        borderColor="divider"
      >
        <IconButton
          size="small"
          onClick={() => setOpen(!open)}
          sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)' }}
        >
          <MenuOutlined />
        </IconButton>
        <Typography fontWeight="bold" variant="h5">
          {currentTenant?.name}
        </Typography>
      </Stack>

      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
};

export default Sidebar;
