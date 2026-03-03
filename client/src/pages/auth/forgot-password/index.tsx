import { Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Input } from '~/components/form';
import { LoginLayout } from '~/components/layouts';
import { Button, Form, Link } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { ForgotPasswordSchema, type ForgotPasswordInput } from '~/schema/forgotPasswordSchema';
import { useForgotPasswordMutation } from '~/services/auth/auth.queries';
import { parseBackendError } from '~/utils/parseBackendError';

export const ForgotPassword = () => {
  const { auth, loading } = useAuthContext();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data, {
      onSuccess: () => {
        toast.success('We have notified the admin of your request for password reset');
        reset();
      },
      onError: (err) => {
        const parsedErr = parseBackendError(err);
        toast.error(`Failed to request password reset: ${parsedErr}`);
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
      <Form
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
          <Typography fontWeight="bold" variant="h5">
            Forgot Password
          </Typography>
          <Stack spacing={3} width="100%" maxWidth={{ xs: '100%', sm: 400 }} px={2}>
            <Input
              control={control}
              name="username"
              label="Username"
              placeholder="Enter your username"
              error={!!errors.username}
            />
            <Button
              disabled={!isValid}
              loading={isPending}
              fullWidth={true}
              variant="contained"
              type="submit"
              size="large"
            >
              Request Password Reset
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">Remember your password?</Typography>
            <Link to="/login" color="info">
              Back to login
            </Link>
          </Stack>
      </Form>
    </LoginLayout>
  );
};
