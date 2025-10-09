import { alpha, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { CardContainer } from '~/components/ui';
import theme from '~/theme';

export const DateTimeDisplay = () => {
  const [dateTime, setDateTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.format('dddd, MMMM D');
  const formattedTime = dateTime.format('hh:mm:ss A');
  
  return (
    <CardContainer sx={{ bgcolor: alpha(theme.palette.info.main, 0.10)}}>
      <Typography>{formattedDate}</Typography>
      <Typography variant="h5" fontWeight="bold">
        {formattedTime}
      </Typography>
    </CardContainer>
  );
};
