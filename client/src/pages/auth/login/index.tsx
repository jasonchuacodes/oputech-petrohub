import { alpha, Box, IconButton, OutlinedInput, Stack, Typography } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { TextField } from '~/components/form';
import { Button, Form, Link, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { LoginUserSchema, type LoginUserInput } from '~/schema/loginUserSchema';
import { useLoginMutation } from '~/services/auth/auth.queries';
import theme from '~/theme';
import { parseBackendError } from '~/utils/parseBackendError';

export const Login = () => {
  const { auth, loading, refetch: refetchAuth } = useAuthContext();
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
  });

  const { mutate: login, isPending: isLoginPending } = useLoginMutation();

  const onSubmit = (data: LoginUserInput) => {
    login(data, {
      onSuccess: () => {
        refetchAuth();
        setError(null);
        navigate('/');
      },
      onError: (err) => {
        const parsedErr = parseBackendError(err);
        setError(parsedErr);
      },
      onSettled: () => {
        reset();
      },
    });
  };

  useEffect(() => {
    if (!loading && auth) {
      navigate('/', { replace: true });
    }
  }, [auth, loading, navigate]);

  if (loading || auth) return null;

  return (
    <PageLayout height="100vh">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
        }}
      >
       <Stack alignItems="center" spacing={1}>
            <Typography fontWeight="bold" variant="h4">
              Sign in to{' '}
              <Box component="span" color="secondary.main">
                Buzhub
              </Box>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome back! Please enter your details.
            </Typography>
          </Stack>
        <Stack spacing={3} width="100%" maxWidth={{ xs: '100%', sm: 400 }} px={2}>
          <Stack spacing={1.5}>
            {(errors.username || errors.password || error) && (
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
                  {errors.username?.message || errors.password?.message || error}
                </Typography>
              </Box>
            )}
            <TextField
              register={register}
              name="username"
              label="Username"
              placeholder="Enter username"
              sx={{ fontSize: 'body2.fontSize' }}
            />
            <Stack spacing={0.5}>
              <Typography variant="body2" fontWeight="medium" color="text.secondary">
                Password
              </Typography>
              <OutlinedInput
                {...register('password')}
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => setIsShowPassword(!isShowPassword)}
                    edge="end"
                  >
                    {isShowPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                  </IconButton>
                }
                size="small"
                type={isShowPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                sx={{ fontSize: 'body2.fontSize' }}
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
            disabled={!isValid}
            loading={isLoginPending}
            fullWidth={true}
            variant="contained"
            type="submit"
            size="large"
          >
            Login
          </Button>
        </Stack>
      </Form>
    </PageLayout>
  );
};
