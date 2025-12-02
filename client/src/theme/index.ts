import { createTheme } from '@mui/material/styles';

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
      default: '#fafbfc',
      paper: '#ffffff',
      surface: '#f4f7f9ff',
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

  typography: {
    fontSize: 14,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#b1b9c2 transparent',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          color: theme.palette.text.secondary,
          paddingBottom: 6,
          paddingTop: 6,
          backgroundColor: theme.palette.background.surface,
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontWeight: 500,
        },
      },
    },
    MuiSvgIcon: {
      defaultProps: {
        fontSize: 'small',
      },
    },
  },
});

export default theme;
