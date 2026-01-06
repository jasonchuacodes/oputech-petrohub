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
          id: 'name',
          heading: 'Fullname',
          cell: (user) => (
            <Link to={user.id}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ '&:hover .username': { fontWeight: 600, textDecoration: 'underline' } }}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  <Typography fontSize="small"> {user.name.charAt(0).toUpperCase()}</Typography>
                </Avatar>
                <Typography variant="body2" color="text.primary" className="username">
                  {user.name}
                </Typography>
              </Stack>
            </Link>
          ),
          orderable: true,
          width: 300,
        },
        {
          id: 'username',
          heading: 'Username',
          cell: (user) => (
            <Typography variant="body2" color="text.secondary">
              {user.username}
            </Typography>
          ),
          orderable: true,
        },
        {
          id: 'role',
          heading: 'Role',
          cell: (user) => (
            <Typography variant="body2" color="text.secondary">
              {toTitleCase(user.role)}
            </Typography>
          ),
          orderable: true,
        },
        {
          id: 'shift',
          heading: 'Shift',
          cell: (user) =>
            user.shiftSchedule ? (
              <Chip label={user.shiftSchedule.shiftName} color={user.shiftSchedule.color} />
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
          cell: (user) => (
            <Typography variant="body2" color="text.secondary">
              {user.position || '-'}
            </Typography>
          ),
          orderable: true,
        },
        {
          id: 'actions',
          heading: '',
          align: 'right',
          cell: (user) => (
            <UserProvider userId={user.id} user={user}>
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
