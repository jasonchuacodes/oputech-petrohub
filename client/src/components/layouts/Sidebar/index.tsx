import {
  CalendarTodayOutlined,
  DashboardOutlined,
  GroupOutlined,
  HomeOutlined,
  InsertChartOutlined,
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
import { useState } from 'react';

const Sidebar = () => {
  const [open, setOpen] = useState(true); // collapse? or expand?
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
        {[
          { label: 'home', icon: HomeOutlined },
          { label: 'dashboard', icon: DashboardOutlined },
          { label: 'reports', icon: InsertChartOutlined },
          { label: 'timesheets', icon: CalendarTodayOutlined },
          { label: 'users', icon: GroupOutlined },
        ].map(({ icon, label }, index) => (
          <ListItem key={index} disablePadding sx={{ height: 48 }}>
            <ListItemButton
              sx={{ display: ' flex', alignItems: 'center', px: 2, height: '100%', gap: 1 }}
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
