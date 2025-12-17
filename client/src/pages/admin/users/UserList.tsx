import { Avatar, Stack, Typography } from '@mui/material';

import { Chip, DataTable, Link } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { UserProvider } from '~/context/user/UserContext';
import { useGetTenantUsersQuery } from '~/services/tenant/tenant.queries';
import { toTitleCase } from '~/utils/textUtils';

import { MoreDetailsMenu } from './MoreDetailsMenu';

export const UserList = () => {
  const { tenantId } = useTenantContext();

  const { data: users, isLoading } = useGetTenantUsersQuery({ tenantId });

  return (
    <DataTable
      id="admin-users-table"
      collection={DataTable.collection({
        items: users || [],
        itemToValue: (user) => user.id,
        itemToString: (user) => user.name,
      })}
      columns={[
        {
          id: 'id',
          heading: 'ID',
          cell: (user) => (
            <Typography variant="body2" color="text.secondary">
              {user.id.slice(0, 8)}
            </Typography>
          ),
          orderable: false,
        },
        {
          id: 'name',
          heading: 'Fullname',
          cell: (user) => (
            <Link to={user.id}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 32, height: 32 }}>
                  <Typography fontSize="small"> {user.name.charAt(0).toUpperCase()}</Typography>
                </Avatar>
                <Stack alignItems="start" justifyContent="start">
                  <Typography variant="body2" color="text.primary">
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{user.username || `user${user.id.slice(0, 4)}`}
                  </Typography>
                </Stack>
              </Stack>
            </Link>
          ),
          orderable: true,
          width: 300,
        },
        {
          id: 'role',
          heading: 'Role',
          cell: (user) => <Typography variant="body2">{toTitleCase(user.role)}</Typography>,
          orderable: true,
        },
        {
          id: 'shift',
          heading: 'Shift',
          cell: (user) =>
            user.shiftSchedule ? (
              <Chip label={user.shiftSchedule.shiftName} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                -
              </Typography>
            ),
          orderable: true,
        },
        {
          id: 'position',
          heading: 'Position',
          cell: (user) => <Typography variant="body2">{user.position || '-'}</Typography>,
          orderable: true,
        },
        {
          id: 'actions',
          heading: '',
          align: 'right',
          cell: (user) => (
            <UserProvider userId={user.id}>
              <MoreDetailsMenu />
            </UserProvider>
          ),
          orderable: false,
        },
      ]}
      loading={isLoading}
      emptyMessage="No users found"
    />
  );
};
