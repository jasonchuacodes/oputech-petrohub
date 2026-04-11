import BaseButton, { type ButtonProps } from '@mui/material/Button';
import type { PropsWithChildren } from 'react';

export const Button = ({ children, sx, ...props }: PropsWithChildren<ButtonProps>) => (
  <BaseButton
    disableElevation
    sx={{
      textTransform: 'none',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      borderRadius: 2,
      flexShrink: 0,
      overflow: 'hidden',
      fontWeight: 'normal',
      px: 2,
      py: 1,

      height: {
        xs: 44,
        sm: 40,
      },

      fontSize: {
        xs: 'body1.fontSize',
        sm: 'body2.fontSize',
      },

      ...(props.variant === 'outlined' && {
        color: props.color ?? 'text.primary',
        borderColor: props.color ?? 'divider',
        bgcolor: 'background.paper',
      }),

      ...sx,
    }}
    {...props}
  >
    {children}
  </BaseButton>
);
