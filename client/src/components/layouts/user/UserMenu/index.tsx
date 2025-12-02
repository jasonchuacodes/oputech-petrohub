import { Avatar, Menu, MenuItem, Typography, Divider, Box, alpha, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useLogoutMutation } from '~/services/auth/auth.queries';
import { UserRoutes } from '~/routes';
import theme from '~/theme';
import { pathFor } from '~/utils/pathFor';
import { toTitleCase } from '~/utils/textUtils';

const UserMenu = ({ onNavigate }: { onNavigate: (to: string) => void }) => {
  const { auth } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: logout } = useLogoutMutation();

  const userInitials = auth ? auth.username?.split('')[0].toUpperCase() : 'U';

  const [anchorElSettingsMenu, setAnchorElSettingsMenu] = useState<null | HTMLElement>(null);
  const isOpenMenu = Boolean(anchorElSettingsMenu);

  const handleNavigateToSettings = () => {
    onNavigate(
      pathFor({
        pathname: UserRoutes.Settings,
      }),
    );

    setAnchorElSettingsMenu(null);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        sessionStorage.clear();

        queryClient.setQueryData(['auth'], null);
        queryClient.cancelQueries();

        navigate('/login');
      },
    });
  };

  return (
    <Box p={1} borderTop="1px solid" borderColor="divider">
      <Button
        onClick={(e) => setAnchorElSettingsMenu(e.currentTarget)}
        fullWidth
        sx={{
          justifyContent: 'flex-start',
          gap: 1,
          p: 1,
          minWidth: 0,
          bgcolor: isOpenMenu ? alpha(theme.palette.primary.light, 0.1) : '',
        }}
      >
        <Avatar alt="profile-picture" sx={{ width: 32, height: 32 }}>
          <Typography>{userInitials}</Typography>
        </Avatar>
        <Stack justifyContent="start" alignItems="start" overflow="hidden" minWidth={0} flex={1}>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              textAlign: 'start',
            }}
          >
            {auth?.name}
          </Typography>
          <Typography color="text.secondary" variant="subtitle2" lineHeight={1}>
            {toTitleCase(auth?.role)}
          </Typography>
        </Stack>
      </Button>
      <Menu
        anchorEl={anchorElSettingsMenu}
        id="settings-menu"
        open={isOpenMenu}
        onClose={() => setAnchorElSettingsMenu(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: -1,
              ml: -1,
              minWidth: 240,
            },
          },
        }}
      >
        <MenuItem dense onClick={handleNavigateToSettings}>
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
        <MenuItem dense onClick={() => null}>
          <Typography variant="body2">Help</Typography>
        </MenuItem>
        <Divider />
        <MenuItem dense onClick={handleLogout}>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
