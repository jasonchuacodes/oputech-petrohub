import { Box, Typography, alpha } from '@mui/material';
import type { ReactNode } from 'react';

import theme from '~/theme';

type InfoBoxProps = {
  variant?: 'info' | 'error' | 'success' | 'warning';
  title?: string;
  children: ReactNode;
};

export const InfoBox = ({ variant = 'info', title, children }: InfoBoxProps) => {
  const paletteMap = {
    info: theme.palette.primary,
    error: theme.palette.error,
    success: theme.palette.success,
    warning: theme.palette.warning,
  };

  const palette = paletteMap[variant];

  return (
    <Box
      sx={{
        textAlign: 'start',
        border: '1px solid',
        p: 1,
        bgcolor: alpha(palette.light, 0.05),
        borderColor: variant === 'error' ? palette.light : 'divider',
        borderRadius: 0.5,
        width: '100%',
      }}
    >
      {title && (
        <Typography fontSize="small" fontWeight="bold" mb={0.5} color={variant}>
          {title}
        </Typography>
      )}
      <Typography fontSize="small" component="div">
        {children}
      </Typography>
    </Box>
  );
};
