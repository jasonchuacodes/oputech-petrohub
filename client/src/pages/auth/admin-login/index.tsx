import { alpha, Box, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { PasswordField, Input } from '~/components/form';
import { LoginLayout } from '~/components/layouts';
import { Button, Form, Link } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { LoginUserSchema, type LoginUserInput } from '~/schema/loginUserSchema';
import { useLoginMutation } from '~/services/auth/auth.queries';
import theme from '~/theme';
import { parseBackendError } from '~/utils/parseBackendError';

export const LoginAdmin = () => {
  const { auth, loading, refetch: refetchAuth } = useAuthContext();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const {
    control,
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
    <LoginLayout>
      <Stack direction="row" height="100%">
        <Stack
          display={{ xs: 'none', md: 'flex' }}
          bgcolor="primary.light"
          flex={1}
          maxWidth="50%"
        />
        <Form
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            flex: 1,
            alignItems: 'center',
            mt: 16,
            gap: 4,
          }}
        >
          <Stack alignItems="center" justifyContent="center" spacing={2}>
            <Box bgcolor="divider" borderRadius={99} height={120} width={120}></Box>
            <Stack alignItems="center" spacing={0.5}>
              <Typography fontWeight="bold" variant="h2">
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please enter your details
              </Typography>
            </Stack>
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
              <Input
                control={control}
                name="username"
                label="Username"
                placeholder="Enter username"
              />
              <PasswordField
                control={control}
                name="password"
                label="Password"
                placeholder="Enter Password"
                randomizer={false}
              />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <FormControlLabel
                  control={<Checkbox size="small" />}
                  label="Remember me"
                  sx={{
                    '& .MuiTypography-root': { fontSize: '0.875rem' },
                  }}
                />
                <Link
                  to="/forgot-password"
                  alignSelf="flex-center"
                  sx={{ fontSize: 'small', color: 'text.main', fontWeight: 'medium' }}
                >
                  Forgot password?
                </Link>
              </Stack>
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
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">Don't have an account?</Typography>
            <Link to="/register" color="info">
              Create an account
            </Link>
          </Stack>
        </Form>
      </Stack>
    </LoginLayout>
  );
};
