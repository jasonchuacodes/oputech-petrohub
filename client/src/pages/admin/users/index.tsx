import { useState } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { AddOutlined, HomeOutlined } from '@mui/icons-material';

import { PageHeader } from '~/components/layouts';
import {
  Breadcrumb,
  Button,
  Chip,
  DataTable,
  Link,
  PageContainer,
  PageLayout,
} from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { UserProvider } from '~/context/user/UserContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { AdminRoutes } from '~/routes';
import { useGetTenantUsersQuery } from '~/services/tenant/tenant.queries';
import { pathFor } from '~/utils/pathFor';
import { formatNumber } from '~/utils/number';
import { toTitleCase } from '~/utils/textUtils';

import { CreateUserModal } from './CreateUserModal';
import { MoreDetailsMenu } from './MoreDetailsMenu';

export const UsersPage = () => {
  const { tenantId } = useTenantContext();
  const disclosure = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading } = useGetTenantUsersQuery({
    tenantId,
    filters: {
      searchTerm: searchTerm || undefined,
    },
  });

  return (
    <PageLayout>
      <PageContainer>
        <Breadcrumb
          items={[
            {
              icon: HomeOutlined,
              label: 'Home',
              to: pathFor({
                pathname: AdminRoutes.TenantHome,
                params: { tenantId },
              }),
            },
            {
              label: 'Users',
            },
          ]}
        />

        <PageHeader
          title="Users"
          description="View and manage users in your organization"
          action={
            <Button
              onClick={disclosure.onOpen}
              variant="contained"
              size="large"
              startIcon={<AddOutlined fontSize="small" />}
            >
              Create User
            </Button>
          }
        />
        <DataTable
          id="admin-users-table"
          collection={DataTable.collection({
            items: users || [],
            itemToValue: (user) => user.id,
            itemToString: (user) => user.name,
          })}
          search={{
            enabled: true,
            placeholder: 'Search employee',
            defaultValue: '',
            onValueChange: setSearchTerm,
          }}
          columns={[
            {
              id: 'id',
              heading: 'ID',
              cell: (user) => (
                <Typography variant="body2" color="text.secondary">
                  {user.employeeId != null ? formatNumber(user.employeeId, 0, 3) : '-'}
                </Typography>
              ),
              orderable: true,
            },
            {
              id: 'name',
              heading: 'Name',
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
            },
            {
              id: 'position',
              heading: 'Position',
              cell: (user) => (
                <Typography variant="body2" color="text.secondary">
                  {user.position || '-'}
                </Typography>
              ),
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
      </PageContainer>

      <CreateUserModal open={disclosure.open} setOpen={disclosure.setOpen} />
    </PageLayout>
  );
};
