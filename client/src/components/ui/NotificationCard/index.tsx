import { CheckCircleOutlined, DeleteOutlined, OpenInNewOutlined } from '@mui/icons-material';
import { Box, Card, CardContent, IconButton, Stack, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

import type {
  Notification,
  PasswordResetRequestMetadata,
} from '~/services/notification/notification.types';

interface NotificationCardProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigateToUser: (userId: string) => void;
}

export const NotificationCard = ({
  notification,
  onMarkRead,
  onDelete,
  onNavigateToUser,
}: NotificationCardProps) => {
  const metadata = notification.metadata as PasswordResetRequestMetadata;

  const handleCardClick = () => {
    onNavigateToUser(metadata.userId);
  };

  const handleMarkRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
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
            <Typography
              variant="body2"
              fontWeight={notification.status === 'UNREAD' ? 'bold' : 'normal'}
            >
              Password reset request from{' '}
              <Box component="span" color="secondary.main">
                {metadata.username}
              </Box>
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(new Date(metadata.requestedAt), { addSuffix: true })}
              </Typography>
              <Typography variant="caption" color="primary.main">
                • Go to user <OpenInNewOutlined sx={{ height: 12, width: 12 }} />
              </Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="flex-start">
            {notification.status === 'UNREAD' && (
              <IconButton size="small" onClick={handleMarkRead}>
                <CheckCircleOutlined fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={handleDelete}>
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
