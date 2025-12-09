import { NotificationsOutlined } from '@mui/icons-material';
import { Badge, IconButton, Menu, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NotificationCard } from '~/components/ui/NotificationCard';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
} from '~/services/notification/notification.queries';
import type { Notification } from '~/services/notification/notification.types';
import { NotificationType } from '~/services/notification/notification.types';
import { pathFor } from '~/utils/pathFor';

export const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { tenantId } = useTenantContext();
  const queryClient = useQueryClient();

  const isOpen = Boolean(anchorEl);

  const { data: notificationsData } = useGetNotificationsQuery();
  const { mutate: markAsRead } = useMarkAsReadMutation();
  const { mutate: deleteNotif } = useDeleteNotificationMutation();

  const notifications = notificationsData?.notifications ?? [];
  const unreadCount = notificationsData?.unreadCount ?? 0;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleMarkRead = (id: string) => {
    markAsRead(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteNotif(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === NotificationType.PASSWORD_RESET_REQUEST) {
      navigate(
        pathFor({
          pathname: AdminRoutes.TenantUserDetail,
          params: { tenantId, userId: notification.metadata.userId },
        }),
      );
      handleClose();
    }
    // DEFAULT type: no action
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsOutlined />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 0.5,
              minWidth: 400,
              maxWidth: 500,
              maxHeight: 600,
            },
          },
        }}
      >
        <Stack px={2} py={1.5} borderBottom={1} borderColor="divider">
          <Typography fontWeight="bold">Notifications</Typography>
        </Stack>

        {notifications.length === 0 ? (
          <Stack p={3} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </Stack>
        ) : (
          <Stack p={1.5} spacing={1} overflow="auto">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
                onClick={handleNotificationClick}
              />
            ))}
          </Stack>
        )}
      </Menu>
    </>
  );
};
