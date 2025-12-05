import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';

import { AppToaster } from './components/ui';
import { InactivityWarningContainer } from './components/ui/InactivityWarning/InactivityWarningContainer';
import { AuthProvider } from './context/auth/AuthContext';
import { InactivityProvider } from './context/inactivity';
import theme from './theme';

const queryClient = new QueryClient();

export const AppLayout = () => {
  return (
    <>
      <CssBaseline />
      <InactivityWarningContainer />
      <Outlet />
    </>
  );
};

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InactivityProvider>
            <AppToaster />
            <AppLayout />
          </InactivityProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
