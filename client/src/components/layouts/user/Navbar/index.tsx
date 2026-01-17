import {
  CalendarTodayOutlined,
  CloseOutlined,
  DashboardOutlined,
  DescriptionOutlined,
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
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

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

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuthContext();

  const [open, setOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: DashboardOutlined,
      to: pathFor({
        pathname: UserRoutes.Home,
      }),
    },
    {
      label: 'Report',
      icon: DescriptionOutlined,
      to: pathFor({
        pathname: UserRoutes.Report,
      }),
    },
    {
      label: 'Timesheets',
      icon: CalendarTodayOutlined,
      to: pathFor({
        pathname: UserRoutes.Timesheets,
      }),
    },
  ];

  const routeTitles: Record<string, string> = {
    [UserRoutes.Home]: 'Dashboard',
    [UserRoutes.Report]: 'Report',
    [UserRoutes.Timesheets]: 'Timesheets',
    [UserRoutes.Settings]: 'Settings',
  };

  const currentTenant = auth?.tenants[0];

  const matchedRoute = Object.keys(routeTitles).find((route) =>
    matchPath({ path: route, end: route === '/' }, location.pathname),
  );

  const pageTitle = matchedRoute ? routeTitles[matchedRoute] : '';

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
          {navItems.map(({ icon, to, label }, index) => {
            const active = location.pathname === to;

            return (
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
                    bgcolor: active ? 'action.selected' : 'transparent',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      '.MuiListItemIcon-root': { fontWeight: active ? 'medium' : 'regular' },
                      color: 'inherit',
                      minWidth: 0,
                    }}
                  >
                    <Icon component={icon} fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    slotProps={{
                      primary: {
                        variant: 'body2',
                      },
                    }}
                    sx={{
                      '.MuiListItemText-primary': {
                        fontWeight: active ? 'medium' : 'regular',
                      },
                    }}
                  >
                    {label}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <UserMenu onNavigate={handleNavigate} />
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
          {pageTitle}
        </Typography>
      </Stack>

      <Drawer open={open} onClose={() => setOpen(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
};

export default Navbar;
