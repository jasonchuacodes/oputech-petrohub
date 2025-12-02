import { AddBoxOutlined } from '@mui/icons-material';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { SearchInput } from '~/components/form';
import { Button, LoadingSpinner, PageLayout } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetTenantUsersQuery } from '~/services/tenant/tenant.queries';

import { UserCreateModal } from './UserCreateModal';
import { UserList } from './UserList';

export const UsersPage = () => {
  const { tenantId } = useTenantContext();

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const { data: tenantUsers, isLoading } = useGetTenantUsersQuery({ tenantId });

  return (
    <PageLayout p={3}>
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={2}>
          {/* Header */}
          <Stack alignItems="center" direction="row" justifyContent="space-between" width="100%">
            <Stack spacing={0.5}>
              <Typography fontWeight="bold" variant="h5">
                Users
              </Typography>
              {!isLoading && (
                <Typography variant="body2" color="text.secondary">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, voluptatibus.
                </Typography>
              )}
            </Stack>

            {!isLoading && (
              <Button
                onClick={() => setIsCreateUserModalOpen(true)}
                startIcon={<AddBoxOutlined />}
                variant="contained"
              >
                Create User
              </Button>
            )}
          </Stack>

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" pt={10}>
              <LoadingSpinner />
            </Box>
          ) : (
            <>
              <SearchInput placeholder="Search employee" />
              {tenantUsers && <UserList users={tenantUsers} />}
            </>
          )}
        </Stack>
      </Container>

      <UserCreateModal open={isCreateUserModalOpen} setOpen={setIsCreateUserModalOpen} />
    </PageLayout>
  );
};
