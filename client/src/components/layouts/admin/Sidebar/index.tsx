import {
  AssessmentOutlined,
  CalendarTodayOutlined,
  DashboardOutlined,
  GroupOutlined,
  HomeOutlined,
  KeyboardDoubleArrowRightOutlined,
} from '@mui/icons-material';
import {
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import { useState, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

export type NavItem = {
  label: string;
  icon: ComponentType;
  to: string;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();

  const [open, setOpen] = useState(true);

  const navItems: NavItem[] = [
    {
      label: 'Home',
      icon: HomeOutlined,
      to: pathFor({
        pathname: AdminRoutes.TenantHome,
        params: { tenantId },
      }),
    },
    {
      label: 'Dashboard',
      icon: DashboardOutlined,
      to: pathFor({
        pathname: AdminRoutes.TenantDashboard,
        params: { tenantId },
      }),
    },
    {
      label: 'Reports',
      icon: AssessmentOutlined,
      to: pathFor({
        pathname: AdminRoutes.TenantReports,
        params: { tenantId },
      }),
    },
    {
      label: 'Timesheets',
      icon: CalendarTodayOutlined,
      to: pathFor({
        pathname: AdminRoutes.TenantTimesheets,
        params: { tenantId },
      }),
    },
    {
      label: 'Users',
      icon: GroupOutlined,
      to: pathFor({
        pathname: AdminRoutes.TenantUsers,
        params: { tenantId },
      }),
    },
  ];

  const handleNavigate = (to: string) => {
    navigate(to);
  };

  return (
    <Stack
      justifyContent="space-between"
      role="presentation"
      width={open ? 240 : 52}
      bgcolor="primary.light"
      color="primary.contrastText"
      position="relative"
      sx={{
        transition: '0.3s ease',
      }}
    >
      <List>
        {navItems.map(({ icon, label, to }, index) => (
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
              {open && <ListItemText>{label}</ListItemText>}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          bottom: 4,
          right: 0,
          transform: 'translate(50%)',
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'background.paper',
          },
        }}
        onClick={() => setOpen(!open)}
      >
        <KeyboardDoubleArrowRightOutlined
          fontSize="small"
          sx={{ transition: 'all 0.3s ease', transform: open ? 'rotate(180deg)' : '' }}
        />
      </IconButton>
    </Stack>
  );
};

export default Sidebar;
