import { zodResolver } from '@hookform/resolvers/zod';
import { List, Stack, Typography } from '@mui/material';
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

type PasswordChangeModalProps = {
  open: boolean;
  onClose: () => void;
};

export const PasswordChangeModal = ({ open, onClose }: PasswordChangeModalProps) => {
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
      submitText="Change Password"
      cancelText="Skip"
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
            <InfoBox variant="info" title="Password requirements:">
              <List sx={{ listStyleType: 'disc', pl: 3, m: 0 }}>
                {[
                  'At least 8 characters',
                  'One uppercase letter (A-Z)',
                  'One lowercase letter (a-z)',
                  'One number (0-9)',
                  'One special character (e.g. !@#$%^&*)',
                ].map((item) => (
                  <Typography key={item} component="li" fontSize="small" sx={{ pl: 1 }}>
                    {item}
                  </Typography>
                ))}
              </List>
            </InfoBox>
            <PasswordField
              required
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Enter you confirm new password"
              randomizer={false}
            />
          </Stack>
        </Stack>
      </Form>
    </CustomModal>
  );
};
