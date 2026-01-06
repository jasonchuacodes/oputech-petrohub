import { zodResolver } from '@hookform/resolvers/zod';
import { LockOutlined } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { PasswordField } from '~/components/form';
import { CustomModal } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { ResetPasswordSchema, type ResetPasswordInput } from '~/schema/resetPasswordSchema';
import { useResetPasswordMutation } from '~/services/user/user.queries';
import { parseBackendError } from '~/utils/parseBackendError';

type Props = {
  open: boolean;
  onClose: () => void;
  userId?: string;
};

export const ResetPasswordModal = ({ open, onClose, userId }: Props) => {
  const { tenantId } = useTenantContext();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const { mutate: resetPassword, isPending } = useResetPasswordMutation();

  const handleCancel = () => {
    onClose();
    reset();
  };

  const onSubmit = handleSubmit((data: ResetPasswordInput) => {
    if (!tenantId || !userId) return;

    resetPassword(
      {
        userId,
        password: data.password,
        tenantId,
      },
      {
        onSuccess: () => {
          toast.success('Password reset successfully! User must change password on next login.');
          onClose();
          reset();
        },
        onError: (err) => {
          const parsedErr = parseBackendError(err);
          toast.error(`Failed to reset password: ${parsedErr}`);
        },
      },
    );
  });

  return (
    <CustomModal
      disabled={!isValid}
      loading={isPending}
      title="Reset User Password"
      subheader="Set a new password for the selected user."
      open={open}
      onClose={handleCancel}
      onCancel={handleCancel}
      maxWidth={520}
      onSubmit={onSubmit}
      submitText="Reset Password"
      icon={LockOutlined}
    >
      <Stack spacing={2} justifyContent="start" alignItems="start">
        <PasswordField
          required
          control={control}
          name="password"
          label="New Password"
          placeholder="*******"
          copiable
          randomizer
        />
      </Stack>
    </CustomModal>
  );
};
