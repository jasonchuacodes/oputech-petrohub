import { Stack } from '@mui/material';
import { AddOutlined, FilterAltOutlined, HomeOutlined } from '@mui/icons-material';

import { SearchInput } from '~/components/form';
import { PageHeader } from '~/components/layouts';
import { Breadcrumb, Button, PageContainer, PageLayout } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

import { CreateUserModal } from './CreateUserModal';
import { UserList } from './UserList';

export const UsersPage = () => {
  const { tenantId } = useTenantContext();
  const disclosure = useDisclosure();

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
        <Stack spacing={1}>
          <Stack
            alignItems="start"
            direction="row"
            justifyContent="space-between"
            width="100%"
            spacing={2}
          >
            <Stack direction="row" spacing={1} width={400}>
              <SearchInput placeholder="Search employee" />
              <Button variant="outlined" endIcon={<FilterAltOutlined fontSize="small" />}>
                Filter
              </Button>
            </Stack>
          </Stack>
          <UserList />
        </Stack>
      </PageContainer>

      <CreateUserModal open={disclosure.open} setOpen={disclosure.setOpen} />
    </PageLayout>
  );
};
