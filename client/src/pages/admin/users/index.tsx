import { Stack } from '@mui/material';
import { FilterAltOutlined } from '@mui/icons-material';
import { useState } from 'react';

import { SearchInput } from '~/components/form';
import { PageHeader } from '~/components/layouts';
import { Button, PageContainer, PageLayout } from '~/components/ui';

import { UserCreateModal } from './UserCreateModal';
import { UserList } from './UserList';

export const UsersPage = () => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  return (
    <PageLayout>
      <PageContainer>
        <PageHeader title="Users" description="View and manage users in your organization" />
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
              <Button
                onClick={() => setIsCreateUserModalOpen(true)}
                variant="contained"
                size="large"
              >
                Create User
              </Button>
            </Stack>
            <UserList />
          </Stack>
      </PageContainer>

      <UserCreateModal open={isCreateUserModalOpen} setOpen={setIsCreateUserModalOpen} />
    </PageLayout>
  );
};
