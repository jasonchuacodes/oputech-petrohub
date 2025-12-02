import { Stack, Typography, Box } from '@mui/material';
import type { ReactNode } from 'react';

type FormRowProps = {
  label: string;
  children: ReactNode;
  required?: boolean;
  labelWidth?: number;
  alignLabel?: string;
};

export const FormRow = ({
  alignLabel = 'center',
  label,
  required,
  children,
  labelWidth = 240,
}: FormRowProps) => {
  return (
    <Stack direction="row" alignItems={alignLabel} spacing={2} width="100%">
      <Box width={labelWidth}>
        <Typography variant="body2" textAlign="start" fontWeight="medium" color="text.secondary">
          {label}
          {required && (
            <Typography variant='body2' component="span" color="error">
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
