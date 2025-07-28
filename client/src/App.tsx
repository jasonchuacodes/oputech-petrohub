import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import { AppToaster } from './components/ui';
import { AuthProvider } from './context/auth/AuthContext';
import theme from './theme';

const queryClient = new QueryClient();

export const AppLayout = () => {
  return (
    <>
      <CssBaseline />
      <Outlet />
    </>
  );
};

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppToaster />
          <AppLayout />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
