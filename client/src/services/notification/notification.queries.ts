import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteNotification, getNotifications, markAsRead } from './notification.api';
import type { NotificationStatus } from './notification.types';

const useGetNotificationsQuery = (status?: NotificationStatus) => {
  return useQuery({
    queryKey: ['notifications', status],
    queryFn: () => getNotifications(status),
  });
};

const useMarkAsReadMutation = () =>
  useMutation({
    mutationFn: markAsRead,
  });

const useDeleteNotificationMutation = () =>
  useMutation({
    mutationFn: deleteNotification,
  });

export { useDeleteNotificationMutation, useGetNotificationsQuery, useMarkAsReadMutation };
