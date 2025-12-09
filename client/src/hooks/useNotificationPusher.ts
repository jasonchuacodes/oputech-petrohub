import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthContext } from '~/context/auth/useAuthContext';
import type { Notification } from '~/services/notification/notification.types';

import { usePusher } from './usePusher';

export const useNotificationPusher = () => {
  const { auth } = useAuthContext();
  const queryClient = useQueryClient();

  const handleNotificationCreated = useCallback(
    (data: { notification: Notification }) => {
      // Optimistically update cache
      queryClient.setQueryData<{ notifications: Notification[]; unreadCount: number }>(
        ['notifications'],
        (old) => {
          if (!old) return old;

          return {
            notifications: [data.notification, ...old.notifications],
            unreadCount: old.unreadCount + 1,
          };
        },
      );
    },
    [queryClient],
  );

  const { pusher } = usePusher({
    channelName: `private-user-${auth?.id}`,
    eventName: 'notification-created',
    onEvent: handleNotificationCreated,
    enabled: !!auth?.id,
  });

  return { pusher };
};
