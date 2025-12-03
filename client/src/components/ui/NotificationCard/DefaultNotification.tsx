import { Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

import type { DefaultNotification as DefaultNotificationType } from '~/services/notification/notification.types';

export const DefaultNotification = ({
  notification,
}: {
  notification: DefaultNotificationType;
}) => {
  return (
    <>
      <Typography variant="body2" fontWeight={notification.status === 'UNREAD' ? 'bold' : 'normal'}>
        {notification.metadata.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {notification.metadata.message}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
      </Typography>
    </>
  );
};
