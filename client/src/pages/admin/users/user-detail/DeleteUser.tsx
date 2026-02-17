import { Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthContext } from '~/context/auth/useAuthContext';
import { Button, Show } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { useDeleteUserMutation } from '~/services/user/user.queries';
import type { User } from '~/services/user/user.types';
import { parseBackendError } from '~/utils/parseBackendError';

import { DeleteConfirmModal } from '../DeleteConfirmModal';

export const DeleteUser = ({ user }: { user?: User }) => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const resetPasswordDisclosure = useDisclosure();

  const { auth } = useAuthContext();
  const { tenantId } = useTenantContext();

  const { mutateAsync: deleteUser, isPending } = useDeleteUserMutation();

  return (
    <Stack spacing={1} bgcolor="background.paper" borderRadius={2} p={2}>
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight="medium" color="error">
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Once you delete this user account, there is no going back. Please be certain.
        </Typography>
      </Stack>

      <Show when={auth?.id !== userId}>
        <Button
          onClick={resetPasswordDisclosure.onOpen}
          disabled={auth?.id === userId}
          color="error"
          variant="outlined"
          sx={{ width: 'fit-content', color: 'error.main' }}
        >
          Delete User
        </Button>
      </Show>

      <DeleteConfirmModal
        loading={isPending}
        open={resetPasswordDisclosure.open}
        onClose={resetPasswordDisclosure.onClose}
        onConfirm={async () => {
          if (!tenantId || !user?.id) return;

          try {
            await deleteUser({
              tenantId,
              userId: user.id,
            });

            toast.success('User deleted successfully');
            navigate(-1);
          } catch (err) {
            const parsedErr = parseBackendError(err);
            toast.error(`Failed to delete user: ${parsedErr}`);
          }
        }}
        user={user}
      />
    </Stack>
  );
};
