import { IconButton, OutlinedInput, Stack, Typography } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Form } from '~/components/ui';
import { LoginUserSchema, type LoginUserInput } from '~/schema/LoginUserSchema';

const HomePage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(LoginUserSchema),
  });

  const login = (data: LoginUserInput) => {
    console.log('Login data:', data);
    reset();
  };

  return (
    <Stack direction="row" height="100vh">
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
          Welcome to ClientHub
        </Typography>
        <Stack spacing={2} width="100%" maxWidth={400}>
          <Stack spacing={1}>
            <OutlinedInput {...register('username')} placeholder="Username" />
            <OutlinedInput
              {...register('password')}
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
          <Button fullWidth={true} variant="contained" type="submit" size="large">
            Login
          </Button>
        </Stack>
      </Form>
    </Stack>
  );
};

export default HomePage;
