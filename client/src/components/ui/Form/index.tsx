import { Stack, type SxProps } from '@mui/material';
import type { PropsWithChildren } from 'react';

type FormProps = PropsWithChildren<{
  onSubmit: React.FormEventHandler<HTMLFormElement>
  sx?: SxProps;
}>;

export const Form = ({ onSubmit, children, sx }: FormProps) => {
  return (
    <Stack component="form" onSubmit={onSubmit} sx={{ ...sx }}>
      {children}
    </Stack>
  );
};
