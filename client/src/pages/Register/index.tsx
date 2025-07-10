import { zodResolver } from '@hookform/resolvers/zod';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Card,
  IconButton,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { PageLayout } from '~/components/layouts';
import { Form, TextField } from '~/components/ui';
import { RegisterUserSchema, type RegisterUserInput } from '~/schema/RegisterUserSchema';
import theme from '~/theme';

const Register = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterUserSchema),
  });

  const onSubmit = (data: RegisterUserInput) => {
    console.log(data);
    reset();
  };

  return (
    <PageLayout
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: theme.palette.background.default,
        gap: 3,
      }}
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
              {(errors.username || errors.password || errors.confirmPassword) && (
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
                  Password
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
              fullWidth={true}
              variant="contained"
              type="submit"
              size="large"
            >
              Create Account
            </Button>
            <Stack direction="row" spacing={1} alignSelf="center">
              <Typography>Already have an account?</Typography>
              <Link href="/" color="info" fontWeight="bold" sx={{ cursor: 'pointer' }}>
                Go to Login
              </Link>
            </Stack>
          </Stack>
        </Form>
      </Card>
    </PageLayout>
  );
};

export default Register;
