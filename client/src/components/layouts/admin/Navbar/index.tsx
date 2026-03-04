import { Avatar, Divider, Stack, Typography } from '@mui/material';

import { Button } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

import { NotificationMenu } from './NotificationMenu';
import NavbarUserMenu from './UserMenu';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();

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
      <Button
        disabled={!tenantId}
        onClick={() =>
          navigate(
            pathFor({
              pathname: AdminRoutes.TenantHome,
              params: { tenantId },
            }),
          )
        }
        variant="text"
        sx={{ gap: 1 }}
      >
        <Avatar
          variant="rounded"
          sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'common.white' }}
        >
          P
        </Avatar>
        <Typography variant="body1" color="text.primary" fontWeight={600}>
          PETROMATE
        </Typography>
      </Button>
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
