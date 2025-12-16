import {
  AssessmentOutlined,
  CalendarTodayOutlined,
  DashboardOutlined,
  GroupOutlined,
  HelpOutlineOutlined,
  PaymentsOutlined,
  ScheduleOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';
import {
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
} from '@mui/material';
import { useState, type ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

import { Toggler } from './Toggler';

export type NavItem = {
  disabled: boolean;
  label: string;
  icon: ComponentType;
  to: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();

  const [open, setOpen] = useState(true);

  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        {
          label: 'Dashboard',
          disabled: false,
          icon: DashboardOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantHome,
            params: { tenantId },
          }),
        },
        {
          label: 'Reports',
          disabled: true,
          icon: AssessmentOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantReports,
            params: { tenantId },
          }),
        },
        {
          label: 'Timesheets',
          disabled: false,
          icon: CalendarTodayOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantTimesheets,
            params: { tenantId },
          }),
        },
        {
          label: 'Payroll',
          disabled: true,
          icon: PaymentsOutlined,
          to: '#',
        },
      ],
    },
    {
      label: 'Management',
      items: [
        {
          label: 'Users',
          disabled: false,
          icon: GroupOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantUsers,
            params: { tenantId },
          }),
        },
        {
          label: 'Shift Schedules',
          disabled: false,
          icon: ScheduleOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantShifts,
            params: { tenantId },
          }),
        },
      ],
    },
    {
      label: 'Other',
      items: [
        {
          label: 'Issues',
          disabled: true,
          icon: WarningAmberOutlined,
          to: '#',
        },
        {
          label: 'Help & Support',
          disabled: true,
          icon: HelpOutlineOutlined,
          to: '#',
        },
      ],
    },
  ];

  const handleNavigate = (to: string) => {
    navigate(to);
  };

  return (
    <Stack
      position="relative"
      justifyContent="space-between"
      role="presentation"
      width={open ? 256 : 56}
      bgcolor="primary.main"
      color="primary.contrastText"
      sx={{
        transition: '0.3s ease',
      }}
    >
      <List>
        {navGroups.map((group, groupIndex) => (
          <Stack key={groupIndex} spacing={0.5} sx={{ mb: 3 }}>
            {open && (
              <ListSubheader
                sx={{
                  bgcolor: 'transparent',
                  color: 'text.disabled',
                  px: 2,
                  pt: 2,
                  pb: 1,
                  typography: 'caption',
                  textTransform: 'uppercase',
                  fontWeight: 'medium',
                }}
              >
                {group.label}
              </ListSubheader>
            )}

            <Stack spacing={1}>
              {group.items.map(({ disabled, icon, label, to }, itemIndex) => {
                const active = location.pathname === to;

                return (
                  <ListItem key={itemIndex} disablePadding sx={{ height: 44, gap: 2 }}>
                    <ListItemButton
                      disabled={disabled}
                      onClick={() => handleNavigate(to)}
                      sx={{
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        mx: open ? 1 : 0.5,
                        px: open ? 3 : 0,
                        gap: 1,
                        height: '100%',
                        borderRadius: 1,
                        bgcolor: active ? 'primary.light' : 'transparent',
                        color: 'primary.alpha',
                        justifyContent: open ? 'flex-start' : 'center',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: 'inherit',
                          minWidth: 0,
                        }}
                      >
                        <Icon component={icon} fontSize="small" />
                      </ListItemIcon>
                      {open && (
                        <ListItemText
                          slotProps={{
                            primary: {
                              variant: 'body2',
                            },
                          }}
                        >
                          {label}
                        </ListItemText>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </Stack>
          </Stack>
        ))}
      </List>

      <Toggler open={open} setOpen={setOpen} />
    </Stack>
  );
};

export default Sidebar;
