import { Typography, Avatar, Stack } from '@mui/material';

import { Widget } from '~/components/ui/Widget';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';
import { toTitleCase } from '~/utils/textUtils';

export const UsersWidget = () => {
  const { tenantId } = useTenantContext();

  const users = [
    { id: '100001', name: 'John Doe', role: 'ADMIN' },
    { id: '100002', name: 'Jane Doe', role: 'ADMIN' },
    { id: '100003', name: 'Michael Kors', role: 'USER' },
  ];

  const navigateTo = pathFor({
    pathname: AdminRoutes.TenantUsers,
    params: {
      tenantId,
    },
  });

  return (
    <Widget title="Users" to={navigateTo}>
      <Stack spacing={1}>
        {users &&
          users.map(({ id, name, role }) => (
            <Stack key={id} direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ height: 32, width: 32 }}></Avatar>
              <Stack>
                <Typography variant="body2">{name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {toTitleCase(role)}
                </Typography>
              </Stack>
            </Stack>
          ))}
      </Stack>
    </Widget>
  );
};
