import { AddBoxOutlined } from '@mui/icons-material';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { SearchInput } from '~/components/form';
import { Button, LoadingSpinner, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useGetTenantUsersQuery } from '~/services/tenant/tenant.queries';
import { useDeleteUserMutation } from '~/services/user/user.queries';
import { parseBackendError } from '~/utils/parseBackendError';

import { UserCreateModal } from './UserCreateModal';
import { UsersList } from './UsersList';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export const UsersPage = () => {
  const { auth } = useAuthContext();
  const { tenantId } = useTenantContext();

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const { data: tenantUsers, isLoading } = useGetTenantUsersQuery({ tenantId });

  const { mutateAsync: deleteUser, isPending: isDeletePending } = useDeleteUserMutation();

  const handleDeleteRequest = (id: string) => setDeleteUserId(id);

  const handleCloseDeleteModal = () => setDeleteUserId(null);

  const handleDeleteUser = async () => {
    if (!deleteUserId || !tenantId) return;

    if (auth?.id === deleteUserId) {
      toast.error('You cannot delete your own account');
      return;
    }

    try {
      await deleteUser({ userId: deleteUserId, tenantId });

      toast.success('Successfully deleted user');
    } catch (err) {
      const parsedErr = parseBackendError(err);
      toast.error(`Failed to delete user: ${parsedErr}`);
    } finally {
      handleCloseDeleteModal();
    }
  };

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
              <SearchInput />
              {tenantUsers && (
                <UsersList users={tenantUsers} onDeleteRequest={handleDeleteRequest} />
              )}
            </>
          )}
        </Stack>
      </Container>

      <UserCreateModal open={isCreateUserModalOpen} setOpen={setIsCreateUserModalOpen} />

      <DeleteConfirmModal
        open={!!deleteUserId}
        loading={isDeletePending}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteUser}
      />
    </PageLayout>
  );
};
