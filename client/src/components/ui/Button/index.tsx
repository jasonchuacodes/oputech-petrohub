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
      px: 1.5,
      py: 1,
      fontSize: {
        xs: 'body1.fontSize',
        sm: 'body2.fontSize',
      },
      ...(props.variant === 'outlined' && {
        color: 'text.primary',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }),

      ...(props.size === 'small' && { fontSize: 'body2.fontSize', height: 36 }),
      ...(props.size === 'large' && { fontSize: 'body1.fontSize', height: 40 }),

      ...sx,
    }}
    {...props}
  >
    {children}
  </BaseButton>
);
