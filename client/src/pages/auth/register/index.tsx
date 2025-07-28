import { zodResolver } from '@hookform/resolvers/zod';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import { alpha, Box, Card, IconButton, OutlinedInput, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { TextField } from '~/components/form';
import { PageLayout } from '~/components/ui';
import { Button, Form, Link } from '~/components/ui';
import { useRegisterUserMutation } from '~/services/auth/auth.queries';
import {
  RegisterUserSchema,
  type RegisterUserInput,
  type RegisterUserPayload,
} from '~/schema/registerUserSchema';
import theme from '~/theme';
import { parseBackendError } from '~/utils/parseBackendError';

export const Register = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const { mutate: registerUser, isPending: isPendingRegistration } = useRegisterUserMutation();

  const onSubmit = (data: RegisterUserPayload) => {
    registerUser(data, {
      onSuccess: () => {
        toast.success('User registered successfully!');
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
              {(errors.name || errors.username || errors.password || errors.confirmPassword) && (
                <Box
                  sx={{
                    border: '1px solid',
                    px: 1,
                    py: 0.5,
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                    borderColor: 'error.light',
                  }}
                >
                  <Typography fontSize="small" color="error">
                    {errors.username?.message ||
                      errors.password?.message ||
                      errors.confirmPassword?.message}
                  </Typography>
                </Box>
              )}
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
                <Typography fontSize="small" fontWeight="bold" color="text.secondary">
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
                <Typography fontSize="small" fontWeight="bold" color="text.secondary">
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
            <Button
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
