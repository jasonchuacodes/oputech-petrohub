import { zodResolver } from '@hookform/resolvers/zod';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import { Card, IconButton, List, OutlinedInput, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { TextField } from '~/components/form';
import { Button, Form, InfoBox, Link, PageLayout } from '~/components/ui';
import { useRegisterUserMutation } from '~/services/auth/auth.queries';
import {
  RegisterUserSchema,
  type RegisterUserInput,
  type RegisterUserPayload,
} from '~/schema/registerUserSchema';
import theme from '~/theme';
import { parseBackendError } from '~/utils/parseBackendError';

export const Register = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RegisterUserInput>({
    mode: 'onChange',
    resolver: zodResolver(RegisterUserSchema),
  });

  const { mutate: registerUser, isPending: isPendingRegistration } = useRegisterUserMutation();

  const onSubmit = (data: RegisterUserPayload) => {
    registerUser(data, {
      onSuccess: () => {
        let countdown = 5;

        const toastId = toast.success(
          () =>
            `Successfully registered user! Redirecting to login in ${countdown} second${countdown !== 1 ? 's' : ''}.`,
          {
            duration: 5000,
          },
        );

        const interval = setInterval(() => {
          countdown--;

          toast.success(
            () =>
              `Successfully registered user! Redirecting to login in ${countdown} second${countdown !== 1 ? 's' : ''}.`,
            { id: toastId },
          );

          if (countdown === 0) {
            clearInterval(interval);
            toast.dismiss(toastId);
            navigate('/login');
          }
        }, 1000);

        reset();
      },
      onError: (err) => {
        const parsedErr = parseBackendError(err);
        toast.error(`Registration failed: ${parsedErr}`);
      },
    });
  };

  return (
    <PageLayout
      alignItems="center"
      bgcolor={theme.palette.background.default}
      display="flex"
      flexDirection="column"
      gap={3}
      justifyContent="center"
      mt={10}
    >
      <Typography variant="h4" fontWeight="bold">
        Register
      </Typography>
      <Card
        sx={{
          p: 4,
          maxHeight: 'fit-content',
          maxWidth: 560,
          width: '50%',
          justifyContent: 'center',
          display: 'flex',
          height: 'fit-content',
        }}
      >
        <Form onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <TextField
                register={register}
                required
                name="name"
                label="Name"
                placeholder="Enter name"
              />
              <TextField
                register={register}
                required
                name="username"
                label="Username"
                placeholder="Enter username"
              />
              <Stack spacing={0.5}>
                <Typography fontWeight="bold" color="text.secondary">
                  Password
                  <Typography component="span" color="error">
                    {' '}
                    *
                  </Typography>
                </Typography>
                <OutlinedInput
                  {...register('password')}
                  size="small"
                  type={isShowPassword ? 'text' : 'password'}
                  placeholder="Password"
                  endAdornment={
                    <IconButton
                      size="small"
                      onClick={() => setIsShowPassword(!isShowPassword)}
                      edge="end"
                    >
                      {isShowPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                    </IconButton>
                  }
                />
              </Stack>
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
                  placeholder="Confirm Password"
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

            {(errors.name || errors.username || errors.password || errors.confirmPassword) && (
              <InfoBox variant="error">
                <Typography fontSize="small" color="error">
                  {errors.name?.message ||
                    errors.username?.message ||
                    errors.password?.message ||
                    errors.confirmPassword?.message}
                </Typography>
              </InfoBox>
            )}

            <Button
              disabled={!isValid}
              loading={isPendingRegistration}
              fullWidth={true}
              variant="contained"
              type="submit"
              size="large"
            >
              Create Account
            </Button>
            <Stack direction="row" spacing={1} alignSelf="center">
              <Typography>Already have an account?</Typography>
              <Link to="/" color="info">
                Go to Login
              </Link>
            </Stack>
          </Stack>
        </Form>
      </Card>
    </PageLayout>
  );
};
