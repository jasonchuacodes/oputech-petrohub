import { OpenInNewOutlined } from '@mui/icons-material';
import { Typography, Box, Stack } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

import type { PasswordResetRequestNotification as PasswordResetRequestNotificationType } from '~/services/notification/notification.types';

export const PasswordResetNotification = ({
  notification,
}: {
  notification: PasswordResetRequestNotificationType;
}) => {
  return (
    <>
      <Typography variant="body2" fontWeight={notification.status === 'UNREAD' ? 'bold' : 'normal'}>
        Password reset request from{' '}
        <Box component="span" color="secondary.main">
          {notification.metadata.username}
        </Box>
      </Typography>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography variant="caption" color="text.secondary">
          {formatDistanceToNow(new Date(notification.metadata.requestedAt), {
            addSuffix: true,
          })}
        </Typography>
        <Typography variant="caption" color="primary.main">
          • Go to user <OpenInNewOutlined sx={{ height: 12, width: 12 }} />
        </Typography>
      </Stack>
    </>
  );
};
