import { createTheme } from "@mui/material";

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
      light: '#FBEAEA',
      dark: '#A01313',
      contrastText: '#FFFFFF',
    },

    warning: {
      main: '#D98A00',
      light: '#FFF4E0',
      dark: '#996300',
      contrastText: '#FFFFFF',
    },

    info: {
      main: '#1E5CA8',
      light: '#E7F0FB',
      dark: '#153F75',
      contrastText: '#FFFFFF',
    },

    success: {
      main: '#0F833C',
      light: '#E3F4EA',
      dark: '#0A5C2B',
      contrastText: '#FFFFFF',
    },
  },

  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,

    h3: {
      fontSize: '24px',
      lineHeight: '120%',
    },

    h4: {
      fontSize: '20px',
      lineHeight: '120%',
    },

    h5: {
      fontSize: '20px',
      lineHeight: '120%',
    },

    h6: {
      fontSize: '16px',
      lineHeight: '140%',
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
