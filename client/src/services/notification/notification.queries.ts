import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteNotification, getNotifications, markAsRead } from './notification.api';

const useGetNotificationsQuery = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
    refetchInterval: 30_000,
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
