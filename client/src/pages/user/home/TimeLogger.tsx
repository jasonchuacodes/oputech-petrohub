import { Typography } from '@mui/material';

import { Switch } from '~/components/ui';
import { CardContainer } from '~/components/dashboard';

export const TimeLogger = () => {
  return (
    <CardContainer direction="row" justifyContent="space-between">
      <Typography>Checked In</Typography>
      <Switch />
    </CardContainer>
  );
};
