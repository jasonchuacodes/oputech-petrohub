import { CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';

import theme from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
        <AppLayout />
      </QueryClientProvider>
    </ThemeProvider>
  );
};
