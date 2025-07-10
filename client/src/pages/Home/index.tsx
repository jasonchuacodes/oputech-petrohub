import { alpha, Box, IconButton, Link, OutlinedInput, Stack, Typography } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { PageLayout } from '~/components/layouts';
import { Button, Form, TextField } from '~/components/ui';
import { LoginUserSchema, type LoginUserInput } from '~/schema/LoginUserSchema';
import theme from '~/theme';

const HomePage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
  });

  const login = (data: LoginUserInput) => {
    console.log('Login data:', data);
    reset();
  };

  return (
    <PageLayout>
      <Stack bgcolor="primary.light" flex={1} maxWidth={1 / 2}></Stack>
      <Form
        onSubmit={handleSubmit(login)}
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
        <Stack spacing={3} width="100%" maxWidth={400}>
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
              required
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

            <Link href="/reset-password" fontWeight="bold" fontSize="small" alignSelf="end">
              Forgot password?
            </Link>
          </Stack>
          <Button fullWidth={true} variant="contained" type="submit" size="large">
            Login
          </Button>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography>New here?</Typography>
          <Link href="/register" color="info" fontWeight="bold" sx={{ cursor: 'pointer' }}>
            Create an account
          </Link>
        </Stack>
      </Form>
    </PageLayout>
  );
};

export default HomePage;
