import { Typography } from '@mui/material';

import { CardContainer } from '~/components/dashboard';

export const DateTimeDisplay = () => {
  return (
    <CardContainer>
      <Typography>Monday, August 25</Typography>
      <Typography variant="h5" fontWeight="bold">
        09:45 AM
      </Typography>
    </CardContainer>
  );
};
