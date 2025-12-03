import { CheckCircleOutlined, CloseOutlined } from '@mui/icons-material';
import { Card, CardContent, IconButton, Stack } from '@mui/material';

import type { Notification } from '~/services/notification/notification.types';
import { NotificationType } from '~/services/notification/notification.types';

import { DefaultNotification } from './DefaultNotification';
import { PasswordResetNotification } from './PasswordResetNotification';

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

export const NotificationCard = ({
  notification,
  onMarkRead,
  onDelete,
  onClick,
}: NotificationCardProps) => {
  const handleCardClick = () => {
    onClick?.(notification);
    onMarkRead(notification.id);
  };

  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  const renderNotification = (notification: Notification) => {
    switch (notification.type) {
      case NotificationType.PASSWORD_RESET_REQUEST:
        return <PasswordResetNotification notification={notification} />;

      case NotificationType.DEFAULT:
        return <DefaultNotification notification={notification} />;
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      variant="outlined"
      sx={{
        bgcolor: notification.status === 'UNREAD' ? 'action.hover' : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'action.selected',
        },
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Stack spacing={0.5} flex={1}>
            {renderNotification(notification)}
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            {notification.status === 'UNREAD' && (
              <IconButton size="small" onClick={handleMarkRead}>
                <CheckCircleOutlined fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={handleDelete}>
              <CloseOutlined fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
