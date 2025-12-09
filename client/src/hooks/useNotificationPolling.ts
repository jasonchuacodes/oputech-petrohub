import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Pusher from 'pusher-js';

const POLLING_INTERVAL = 60000; // 60 seconds

export const useNotificationPolling = (pusher: Pusher | null) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!pusher) return;

    const handleStateChange = (state: { current: string }) => {
      const connected = state.current === 'connected';
      setIsConnected(connected);

      if (!connected) {
        // Start polling when disconnected
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          }, POLLING_INTERVAL);
        }
      } else {
        // Stop polling when connected
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    pusher.connection.bind('state_change', handleStateChange);

    return () => {
      pusher.connection.unbind('state_change', handleStateChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pusher, queryClient]);

  return { isConnected };
};
