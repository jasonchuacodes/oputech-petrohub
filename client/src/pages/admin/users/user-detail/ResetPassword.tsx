import { Stack, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthContext } from '~/context/auth/useAuthContext';
import { Button } from '~/components/ui';
import { useDisclosure } from '~/hooks/useDisclosure';
import { pathFor } from '~/utils/pathFor';
import { AdminRoutes } from '~/routes';
import { useTenantContext } from '~/context/tenant/useTenantContext';

import { ResetPasswordModal } from '../ResetPasswordModal';

export const ResetPassword = () => {
  const { userId } = useParams();

  const { tenantId } = useTenantContext();
  const navigate = useNavigate();
  const { auth } = useAuthContext();

  const resetPasswordDisclosure = useDisclosure();

  return (
    <Stack spacing={1} bgcolor="background.paper" borderRadius={2} p={2}>
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight="medium">
          Security
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Resetting this user’s password will automatically log them out of current sessions.
        </Typography>
      </Stack>

      <Button
        onClick={resetPasswordDisclosure.onOpen}
        disabled={auth?.id === userId}
        color="error"
        variant="outlined"
        sx={{ width: 'fit-content' }}
      >
        Reset Password
      </Button>

      {auth?.id === userId && (
        <Typography variant="caption" color="text.secondary">
          You cannot reset your own password here. Please go to the{' '}
          <Typography
            variant="caption"
            color="info"
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() =>
              navigate(
                pathFor({
                  pathname: AdminRoutes.TenantAccountSettings,
                  params: { tenantId },
                }),
              )
            }
          >
            account settings
          </Typography>{' '}
          section.
        </Typography>
      )}

      <ResetPasswordModal
        open={resetPasswordDisclosure.open}
        onClose={resetPasswordDisclosure.onClose}
        userId={userId}
      />
    </Stack>
  );
};
