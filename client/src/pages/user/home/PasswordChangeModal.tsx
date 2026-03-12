import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { PasswordField } from '~/components/form';
import { CustomModal, Form, InfoBox } from '~/components/ui';
import { useForceUpdatePasswordMutation } from '~/services/auth/auth.queries';
import {
  ForceUpdatePasswordSchema,
  type ForceUpdatePasswordInput,
} from '~/schema/forceUpdatePassword';
import { parseBackendError } from '~/utils/parseBackendError';
import { LockOutline } from '@mui/icons-material';

type PasswordChangeModalProps = {
  open: boolean;
  onClose: () => void;
};

export const PasswordChangeModal = ({ open, onClose }: PasswordChangeModalProps) => {
  const queryClient = useQueryClient();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<ForceUpdatePasswordInput>({
    resolver: zodResolver(ForceUpdatePasswordSchema),
    mode: 'onChange',
  });

  const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
    useForceUpdatePasswordMutation();

  const onSubmit = handleSubmit((data: ForceUpdatePasswordInput) => {
    updatePassword(data, {
      onSuccess: () => {
        toast.success('Password updated successfully.');
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        onClose();
        reset();

        sessionStorage.removeItem('skipPasswordChange');
      },
      onError: (err) => {
        const errorMessage = parseBackendError(err);
        toast.error(`Failed to update password: ${errorMessage}`);
      },
    });
  });

  const handleSkip = () => {
    sessionStorage.setItem('skipPasswordChange', 'true');
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={handleSkip}
      onSubmit={onSubmit}
      disabled={!isValid || isUpdatePasswordPending}
      title="Change Password"
      subheader="Nominate a new password for your account."
      submitText="Change Password"
      cancelText="Skip"
      icon={LockOutline}
    >
      <Form onSubmit={onSubmit}>
        <Stack justifyContent="center" alignItems="center" spacing={2} pb={2}>
          <Stack spacing={1} width="100%">
            <PasswordField
              required
              control={control}
              name="newPassword"
              label="New Password"
              placeholder="Enter your new password"
              randomizer={false}
            />
            <PasswordField
              required
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Enter you confirm new password"
              randomizer={false}
            />
          </Stack>
          <InfoBox variant="info" title="Password requirements:">
            <Typography fontSize="small">New password should be at least 6 characters.</Typography>
          </InfoBox>
        </Stack>
      </Form>
    </CustomModal>
  );
};
