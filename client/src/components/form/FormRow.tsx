import { Stack, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

type FormRowProps = {
  label: string;
  children: ReactNode;
  required?: boolean;
  labelWidth?: number;
  alignLabel?: string
};

export const FormRow = ({ alignLabel = 'center', label, required, children, labelWidth = 240 }: FormRowProps) => {
  return (
    <Stack direction="row" alignItems={alignLabel} spacing={2} width="100%">
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
