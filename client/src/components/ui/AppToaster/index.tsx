import { Toaster } from 'react-hot-toast';
import { useTheme } from '@mui/material';

export const AppToaster = () => {
  const theme = useTheme();

  return (
    <Toaster
      toastOptions={{
        style: {
          fontFamily: 'inherit',
          fontSize: '14px',
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: '1px solid',
          borderColor: theme.palette.divider,
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
        },
        success: {
          iconTheme: {
            primary: theme.palette.success.main,
            secondary: theme.palette.success.contrastText,
          },
        },
        error: {
          iconTheme: {
            primary: theme.palette.error.main,
            secondary: theme.palette.error.contrastText,
          },
        },
      }}
    />
  );
};
