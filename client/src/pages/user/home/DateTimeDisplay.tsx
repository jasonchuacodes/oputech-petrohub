import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { CardContainer } from '~/components/dashboard';

export const DateTimeDisplay = () => {
  const [dateTime, setDateTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDate = dateTime.format('dddd, MMMM D');
  const formattedTime = dateTime.format('hh:mm A');
  
  return (
    <CardContainer>
      <Typography>{formattedDate}</Typography>
      <Typography variant="h5" fontWeight="bold">
        {formattedTime}
      </Typography>
    </CardContainer>
  );
};
