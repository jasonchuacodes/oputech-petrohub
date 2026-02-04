import { zodResolver } from '@hookform/resolvers/zod';
import { Card, List, Stack, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { PasswordField, Input } from '~/components/form';
import { Button, Form, InfoBox, Link, PageLayout } from '~/components/ui';
import { PublicRoutes } from '~/routes';
import { useRegisterUserMutation } from '~/services/auth/auth.queries';
import {
  RegisterUserSchema,
  type RegisterUserInput,
  type RegisterUserPayload,
} from '~/schema/registerUserSchema';
import theme from '~/theme';
import { pathFor } from '~/utils/pathFor';
import { parseBackendError } from '~/utils/parseBackendError';

export const Register = () => {
  const navigate = useNavigate();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    control,
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
        let countdown = 3;

        const toastId = toast.success(
          `Successfully registered user! Redirecting to login in ${countdown} seconds.`,
          { duration: 3000 },
        );

        intervalRef.current = setInterval(() => {
          countdown--;

          if (countdown > 0) {
            toast.success(
              `Successfully registered user! Redirecting to login in ${countdown} second${countdown !== 1 ? 's' : ''}.`,
              { id: toastId },
            );
          } else {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      toast.dismiss();
    };
  }, []);

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
      <Typography fontWeight="bold" variant="h5">
        Register
      </Typography>
      <Card
        sx={{
          p: 4,
          maxHeight: 'fit-content',
          width: {
            xs: '95%',
            sm: '90%',
            md: '70%',
            lg: 560,
          },
          justifyContent: 'center',
          display: 'flex',
          height: 'fit-content',
          mx: 'auto',
        }}
      >
        <Form onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          <Stack spacing={3}>
            <Stack spacing={1.5}>
              <Input
                control={control}
                required
                name="name"
                label="Name"
                placeholder="Enter name"
              />
              <Input
                control={control}
                required
                name="username"
                label="Username"
                placeholder="Enter username"
              />
              <PasswordField
                required
                control={control}
                name="password"
                label="Password"
                placeholder="Password"
                randomizer={false}
              />
              <PasswordField
                required
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm Password"
                randomizer={false}
              />
            </Stack>

            <InfoBox variant="info" title="Password requirements:">
              <List sx={{ listStyleType: 'disc', pl: 2, m: 0 }}>
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
              <Typography variant="body2">Already have an account?</Typography>
              <Link
                to={pathFor({
                  pathname: PublicRoutes.LoginAdmin,
                })}
                color="info"
              >
                Go to Login
              </Link>
            </Stack>
          </Stack>
        </Form>
      </Card>
    </PageLayout>
  );
};
