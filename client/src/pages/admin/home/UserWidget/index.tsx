import { Typography, Avatar, Stack } from '@mui/material';

import { SkeletonList, Widget } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { useGetTenantUsersQuery } from '~/services/tenant/tenant.queries';
import { pathFor } from '~/utils/pathFor';
import { toTitleCase } from '~/utils/textUtils';

export const UsersWidget = () => {
  const { tenantId } = useTenantContext();

  const { data: users, isFetching: isFetchingUsers } = useGetTenantUsersQuery({
    tenantId,
  });

  const navigateTo = pathFor({
    pathname: AdminRoutes.TenantUsers,
    params: {
      tenantId,
    },
  });

  return (
    <Widget title="Users" to={navigateTo}>
      <Stack spacing={1}>
        {isFetchingUsers ? (
          <SkeletonList rows={3} />
        ) : (
          users?.map(({ id, name, role }) => (
            <Stack key={id} direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ height: 32, width: 32 }}></Avatar>
              <Stack>
                <Typography variant="body2">{name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {toTitleCase(role)}
                </Typography>
              </Stack>
            </Stack>
          ))
        )}
      </Stack>
    </Widget>
  );
};
