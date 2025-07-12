import { Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Button } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useLogoutMutation } from '~/services/auth/auth.queries';

export const Home = () => {
  const { setAuth } = useAuthContext()
  const navigate = useNavigate();
  const { mutate: logout } = useLogoutMutation();

  const handleLogout = () => {
    logout(undefined, { onSuccess: () => navigate('/login') });

    logout(undefined, {
      onSuccess: () => {
        setAuth(null)
        navigate('/login')
      }
    })
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
