import { Paper as BasePaper, type PaperProps } from '@mui/material';

export const Paper = (props: PaperProps) => (
  <BasePaper
    {...props}
    elevation={0}
    sx={{
      boxShadow: 'none',
      ...(props.sx || {}),
    }}
  />
);

