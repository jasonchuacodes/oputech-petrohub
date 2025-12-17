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
      minWidth: 'fit-content',
      flexShrink: 0,
      overflow: 'hidden',
      fontWeight: 'normal',
      px: 1.5,
      py: 1,

      ...(props.variant === 'outlined' && {
        color: 'text.primary',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }),

      ...(props.size === 'small' && { height: 36 }),
      ...(props.size === 'large' && { height: 40 }),

      ...sx,
    }}
    {...props}
  >
    {children}
  </BaseButton>
);
