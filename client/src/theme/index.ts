import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#213343',
      light: '#3f4d5f',
      dark: '#101e29',
      contrastText: '#ffffff',
    },

    secondary: {
      main: '#D88373',
      light: '#e5a193',
      dark: '#b15e50',
      contrastText: '#ffffff',
    },

    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },

    text: {
      primary: '#1a1a1a',
      secondary: '#5f6b7a',
      disabled: '#a0a0a0',
    },

    error: {
      main: '#d32f2f',
      light: '#e57373',
      dark: '#c62828',
      contrastText: '#fff',
    },

    warning: {
      main: '#f57c00',
      light: '#ffb74d',
      dark: '#ef6c00',
      contrastText: '#fff',
    },

    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#fff',
    },

    success: {
      main: '#2e7d32',
      light: '#81c784',
      dark: '#1b5e20',
      contrastText: '#fff',
    },
  },
});

export default theme;
