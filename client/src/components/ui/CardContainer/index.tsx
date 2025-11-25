import { Stack, type StackProps } from '@mui/material';

export const CardContainer = (props: StackProps) => {
  return (
    <Stack
      bgcolor="background.paper"
      p={2}
      borderRadius={1}
      border="1px solid"
      borderColor="divider"
      height='100%'
      {...props}
    />
  );
};
