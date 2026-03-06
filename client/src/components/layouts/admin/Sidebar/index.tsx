import {
  AssessmentOutlined,
  CalendarTodayOutlined,
  DashboardOutlined,
  GroupOutlined,
  HelpOutlineOutlined,
  InventoryOutlined,
  LocalGasStationOutlined,
  PaymentsOutlined,
  ScheduleOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';
import {
  Box,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
} from '@mui/material';
import { type ComponentType, useEffect } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';

import { Show } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

import { Toggler } from './Toggler';
import TenantSelector from './TenantSelector';

export type NavItem = {
  disabled?: boolean;
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
  const location = useLocation();
  const { tenantId } = useTenantContext();

  const disclosure = useDisclosure(localStorage.getItem('sidebar:open') !== 'false');

  useEffect(() => {
    localStorage.setItem('sidebar:open', String(disclosure.open));
  }, [disclosure.open]);

  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        {
          label: 'Dashboard',
          icon: DashboardOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantHome,
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
      ],
    },
    {
      label: 'Products',
      items: [
        {
          label: 'Fuel',
          icon: LocalGasStationOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantProducts,
            params: { tenantId },
          }),
        },
        {
          label: 'Inventory',
          icon: InventoryOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantInventory,
            params: { tenantId },
          }),
        },
      ],
    },
    {
      label: 'Management',
      items: [
        {
          label: 'Users',
          icon: GroupOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantUsers,
            params: { tenantId },
          }),
        },
        {
          label: 'Shift Schedules',
          icon: ScheduleOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantShifts,
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
          label: 'Payroll',
          icon: PaymentsOutlined,
          to: pathFor({
            pathname: AdminRoutes.TenantPayroll,
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
      justifyContent="space-between"
      role="presentation"
      width={disclosure.open ? 256 : 58}
      bgcolor="primary.main"
      height="100%"
      sx={{
        transition: '0.3s ease',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="stretch"
        sx={{ mx: disclosure.open ? 1 : 0.5 }}
        gap={0.5}
        borderBottom={1}
        borderColor="primary.light"
        py={1.5}
      >
        <Show when={disclosure.open}>
          <Box flex={1}>
            <TenantSelector />
          </Box>
        </Show>
        <Toggler open={disclosure.open} setOpen={disclosure.setOpen} />
      </Stack>
      <List sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <Stack spacing={1}>
          {navGroups.map((group, groupIndex) => (
            <Stack key={groupIndex} spacing={1}>
              <Show when={disclosure.open}>
                <ListSubheader
                  sx={{
                    bgcolor: 'transparent',
                    color: 'text.disabled',
                    typography: 'body2',
                  }}
                >
                  {group.label}
                </ListSubheader>
              </Show>
              {group.items.map(({ disabled, icon, label, to }, itemIndex) => {
                const active =
                  disabled || to === '#'
                    ? false
                    : !!matchPath(
                        {
                          path: to,
                          end:
                            to ===
                            pathFor({
                              pathname: AdminRoutes.TenantHome,
                              params: { tenantId },
                            }),
                        },
                        location.pathname,
                      );

                return (
                  <ListItem key={itemIndex} disablePadding>
                    <ListItemButton
                      disabled={disabled}
                      onClick={() => handleNavigate(to)}
                      sx={{
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        mx: disclosure.open ? 1 : 0.5,
                        px: disclosure.open ? 3 : 0,
                        gap: 1,
                        height: '100%',
                        borderRadius: 2,
                        bgcolor: active ? 'primary.light' : 'transparent',
                        color: 'primary.alpha',
                        justifyContent: disclosure.open ? 'flex-start' : 'center',
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
                      <Show when={disclosure.open}>
                        <ListItemText
                          slotProps={{
                            primary: {
                              variant: 'body2',
                            },
                          }}
                        >
                          {label}
                        </ListItemText>
                      </Show>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </Stack>
          ))}
        </Stack>
      </List>
    </Stack>
  );
};

export default Sidebar;
