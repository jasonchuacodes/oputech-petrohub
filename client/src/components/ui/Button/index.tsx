import BaseButton, { type ButtonProps } from '@mui/material/Button';
import type { PropsWithChildren } from 'react';

export const Button = ({ children, sx, ...props }: PropsWithChildren<ButtonProps>) => {
  return (
    <BaseButton disableElevation={true} sx={{ textTransform: 'none', ...sx }} {...props}>
      {children}
    </BaseButton>
  );
};
