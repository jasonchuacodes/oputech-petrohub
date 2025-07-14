import { Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/ui';
import { useLogoutMutation } from '~/services/auth/auth.queries';

export const Home = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: logout } = useLogoutMutation();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.setQueryData(['auth'], null);
      },
      onSettled: () => {
        navigate('/login');
      },
    });
  };

  return (
    <Stack>
      <Typography>Home Page</Typography>
      <Button onClick={handleLogout} variant="contained">
        Logout
      </Button>
    </Stack>
  );
};
