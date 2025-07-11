import { alpha, Box, IconButton, OutlinedInput, Stack, Typography } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useLoginMutation } from '~/components/api/auth/auth.queries';
import { PageLayout } from '~/components/layouts';
import { Button, Form, Link, TextField } from '~/components/ui';
import { LoginUserSchema, type LoginUserInput } from '~/schema/LoginUserSchema';
import theme from '~/theme';

const Login = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
  });

  const { mutate: login, isPending: isLoginPending } = useLoginMutation();

  const onSubmit = (data: LoginUserInput) => {
    login(data, {
      onSuccess: () => console.log('Successfully logged in'),
      onError: (err) => console.log('Failed to login: ', err.message),
    });

    reset();
  };

  return (
    <PageLayout>
      <Stack bgcolor="primary.light" flex={1} maxWidth={1 / 2}></Stack>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Welcome to Business
        </Typography>
        <Stack spacing={3} width="100%" maxWidth={400} minWidth={400} px={2}>
          <Stack spacing={1.5}>
            {(errors.username || errors.password) && (
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
                  {errors.username?.message || errors.password?.message}
                </Typography>
              </Box>
            )}
            <TextField
              register={register}
              name="username"
              label="Username"
              placeholder="Enter username"
            />
            <Stack spacing={0.5}>
              <Typography fontSize="small" fontWeight="bold" color="text.secondary">
                Password
              </Typography>
              <OutlinedInput
                {...register('password')}
                size="small"
                type={isShowPassword ? 'text' : 'password'}
                placeholder="Enter Password"
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

            <Link
              to="/forgot-password"
              alignSelf="flex-end"
              sx={{ fontSize: 'small', color: 'text.main' }}
            >
              Forgot password?
            </Link>
          </Stack>
          <Button
            loading={isLoginPending}
            fullWidth={true}
            variant="contained"
            type="submit"
            size="large"
          >
            Login
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography>New here?</Typography>
          <Link to="/register" color="info">
            Create an account
          </Link>
        </Stack>
      </Form>
    </PageLayout>
  );
};

export default Login;
