import { zodResolver } from '@hookform/resolvers/zod';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Divider, IconButton, List, OutlinedInput, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { Button, Form, InfoBox } from '~/components/ui';
import { UpdatePasswordSchema, type UpdatePasswordInput } from '~/schema/updatePasswordSchema';
import { useUpdatePasswordMutation } from '~/services/auth/auth.queries';
import { parseBackendError } from '~/utils/parseBackendError';

export const SecuritySettings = () => {
  const navigate = useNavigate();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(UpdatePasswordSchema),
    mode: 'onChange',
  });

  const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
    useUpdatePasswordMutation();

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  const onSubmit = handleSubmit((data: UpdatePasswordInput) => {
    const { oldPassword, newPassword } = data;

    updatePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          let countdown = 5;

          const toastId = toast.success(
            `Password updated successfully! Logging you out in ${countdown} seconds.`,
            { duration: 5000 },
          );

          intervalRef.current = setInterval(() => {
            countdown--;

            if (countdown > 0) {
              toast.success(
                `Password updated successfully! Logging you out in ${countdown} second${
                  countdown !== 1 ? 's' : ''
                }.`,
                { id: toastId },
              );
            } else {
              clearInterval(intervalRef.current!);
              intervalRef.current = null;
              toast.dismiss(toastId);

              sessionStorage.clear();

              queryClient.setQueryData(['auth'], null);
              queryClient.cancelQueries();

              navigate('/login');
            }
          }, 1000);

          reset();
        },
        onError: (err) => {
          const errorMessage = parseBackendError(err);
          toast.error(`Failed to update password: ${errorMessage}`);
        },
      },
    );
  });

  return (
    <Stack spacing={2}>
      <Form onSubmit={onSubmit}>
        <Stack justifyContent="center" alignItems="center" spacing={2} pb={2}>
          <Stack spacing={1} width="100%">
            <Stack spacing={0.5}>
              <Typography fontWeight="bold" color="text.secondary">
                Old Password
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              </Typography>
              <OutlinedInput
                {...register('oldPassword')}
                size="small"
                type={isShowOldPassword ? 'text' : 'password'}
                placeholder="Enter your old password"
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => setIsShowOldPassword(!isShowOldPassword)}
                    edge="end"
                  >
                    {isShowOldPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                  </IconButton>
                }
              />
            </Stack>

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

          <Divider sx={{ width: '100%' }} />
          <Stack width="100%" direction="row" spacing={1}>
            <Button disableElevation={true} onClick={handleCancel} type="button" variant="outlined">
              Cancel
            </Button>
            <Button
              disabled={!isValid || isUpdatePasswordPending}
              type="submit"
              variant="contained"
            >
              Change Password
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Stack>
  );
};
