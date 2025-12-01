import { zodResolver } from '@hookform/resolvers/zod';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Divider, IconButton, List, OutlinedInput, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Button, Form, InfoBox } from '~/components/ui';
import { UpdatePasswordSchema, type UpdatePasswordInput } from '~/schema/updatePasswordSchema';
import { useUpdatePasswordMutation } from '~/services/auth/auth.queries';
import { parseBackendError } from '~/utils/parseBackendError';

export const SecuritySettings = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
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

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
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
          toast.success('Password updated successfully!');
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
                type={showPassword.oldPassword ? 'text' : 'password'}
                placeholder="Enter your old password"
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => togglePasswordVisibility('oldPassword')}
                    edge="end"
                  >
                    {showPassword.oldPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
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
                type={showPassword.newPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    edge="end"
                  >
                    {showPassword.newPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
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
                type={showPassword.confirmPassword ? 'text' : 'password'}
                placeholder="Enter you confirm new password"
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    edge="end"
                  >
                    {showPassword.confirmPassword ? (
                      <VisibilityOutlined />
                    ) : (
                      <VisibilityOffOutlined />
                    )}
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
