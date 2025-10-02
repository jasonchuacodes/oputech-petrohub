import { zodResolver } from '@hookform/resolvers/zod';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { IconButton, List, OutlinedInput, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

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
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const {
    register,
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
            <Stack spacing={0.5}>
              <Typography fontWeight="bold" color="text.secondary">
                New Password
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              </Typography>
              <OutlinedInput
                {...register('newPassword')}
                size="small"
                type={isShowNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                    edge="end"
                  >
                    {isShowNewPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                  </IconButton>
                }
              />
            </Stack>
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
            <Stack spacing={0.5}>
              <Typography fontWeight="bold" color="text.secondary">
                Confirm Password
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              </Typography>
              <OutlinedInput
                {...register('confirmPassword')}
                size="small"
                type={isShowConfirmPassword ? 'text' : 'password'}
                placeholder="Enter you confirm new password"
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                    edge="end"
                  >
                    {isShowConfirmPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                  </IconButton>
                }
              />
            </Stack>
          </Stack>
        </Stack>
      </Form>
    </CustomModal>
  );
};
