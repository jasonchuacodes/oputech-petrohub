import { Stack, type StackProps } from '@mui/material';

export const CardContainer = (props: StackProps) => {
  return (
    <Stack
      bgcolor="background.paper"
      p={2}
      borderRadius={2}
      height='100%'
      {...props}
    />
  );
};
