import { alpha, Typography } from '@mui/material';
import { useState } from 'react';

import { Switch } from '~/components/ui';
import { CardContainer } from '~/components/dashboard';
import theme from '~/theme';

export const TimeLogger = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const isActive = isCheckedIn;

  const styles = {
    borderColor: isActive ? theme.palette.success.light : theme.palette.grey[400],
    bgcolor: isActive
      ? alpha(theme.palette.success.dark, 0.1)
      : alpha(theme.palette.grey[600], 0.2),
  };

  return (
    <CardContainer
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={styles}
    >
      <Typography
        fontWeight="bold"
        color={isActive ? 'success.dark' : 'text.primary'}
      >
        {isActive ? 'Checked In' : 'Check In'}
      </Typography>

      <Switch
        checked={isActive}
        onChange={(e) => setIsCheckedIn(e.target.checked)}
      />
    </CardContainer>
  );
};