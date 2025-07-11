import { CssBaseline, ThemeProvider } from '@mui/material';
import { Outlet } from 'react-router-dom';

import theme from './theme';

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
        <AppLayout />
    </ThemeProvider>
  );
};
