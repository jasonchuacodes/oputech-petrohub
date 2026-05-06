import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#0F3B34',
      light: '#1A4F47',
      dark: '#0A2823',
      alpha: '#D6DDDC',
    },

    background: {
      default: '#F4F4F4',
      paper: '#FFFFFF',
      surface: '#FCFCFC',
    },

    text: {
      primary: '#272727',
      secondary: '#6E6E6E',
      disabled: '#BDBDBD',
    },

    divider: '#E2E2E2',

    error: {
      main: '#C82121',
      light: '#D94545',
      dark: '#A01313',
      background: '#FEF1F1',
      surface: '#F5C7C7',
    },

    warning: {
      main: '#D98A00',
      light: '#eedfb4',
      dark: '#996300',
      background: '#FEF6ED',
      surface: '#FCE4C4',
    },

    info: {
      main: '#0F70CC',
      light: '#c3d3eb',
      dark: '#153F75',
      background: '#F7F9FC',
      surface: '#DFEDFB',
    },

    success: {
      main: '#259961',
      light: '#C1E0CE',
      dark: '#0F3B34',
      background: '#F5FAF6',
      surface: '#E7F5E9',
    },
  },

  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,

    h2: {
      fontSize: '32px',
      lineHeight: '120%',
    },

    h3: {
      fontSize: '28px',
      lineHeight: '120%',
    },

    h4: {
      fontSize: '24px',
      lineHeight: '120%',
    },

    h5: {
      fontSize: '20px',
      lineHeight: '120%',
    },

    h6: {
      fontSize: '18px',
      lineHeight: '140%',
      fontWeight: 400,
    },

    body1: {
      fontSize: '16px',
      lineHeight: '140%',
    },

    subtitle1: {
      fontSize: '16px',
      lineHeight: '140%',
    },

    body2: {
      fontSize: '14px',
      lineHeight: '140%',
    },

    subtitle2: {
      fontSize: '14px',
      lineHeight: '140%',
    },

    button: {
      fontSize: '14px',
      lineHeight: '140%',
      textTransform: 'none',
      minWidth: '64px',
    },

    caption: {
      fontSize: '12px',
      lineHeight: '140%',
    },

    overline: {
      fontSize: '12px',
      lineHeight: '140%',
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#b1b9c2 transparent',
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
