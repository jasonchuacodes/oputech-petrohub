import BaseButton, { type ButtonProps } from '@mui/material/Button';
import type { PropsWithChildren } from 'react';

export const Button = ({ children, sx, ...props }: PropsWithChildren<ButtonProps>) => {
  return (
    <BaseButton
      disableElevation={true}
      sx={{
        textTransform: 'none',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        
        minWidth: ' fit-content',
        flexShrink: 0,
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {children}
    </BaseButton>
  );
};
