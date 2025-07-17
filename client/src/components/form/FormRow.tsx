import { Stack, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

type FormRowProps = {
  label: string;
  children: ReactNode;
  required?: boolean;
  labelWidth?: number;
};

export const FormRow = ({ label, required, children, labelWidth = 240 }: FormRowProps) => {
  return (
    <Stack direction="row" alignItems="flex-start" spacing={2} width="100%">
      <Box width={labelWidth}>
        <Typography textAlign="start" fontWeight="bold" color="text.secondary">
          {label}
          {required && (
            <Typography component="span" color="error">
              {' '}
              *
            </Typography>
          )}
        </Typography>
      </Box>
      {children}
    </Stack>
  );
};
