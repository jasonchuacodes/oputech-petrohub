import { useEffect, useRef } from 'react';
import Pusher, { Channel } from 'pusher-js';

import axios from '~/lib/axiosInstance';

interface UsePusherConfig<T = unknown> {
  channelName: string;
  eventName: string;
  onEvent: (data: T) => void;
  enabled?: boolean;
}

export const usePusher = <T = unknown>({ channelName, eventName, onEvent, enabled = true }: UsePusherConfig<T>) => {
  const pusherRef = useRef<Pusher | null>(null);
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // Initialize Pusher client
    if (!pusherRef.current) {
      pusherRef.current = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
        cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        authorizer: (channel) => ({
          authorize: async (socketId, callback) => {
            try {
              const response = await axios.post('/pusher/auth', {
                socket_id: socketId,
                channel_name: channel.name,
              });
              callback(null, response.data);
            } catch (error) {
              callback(error as Error, null);
            }
          },
        }),
      });
    }

    // Subscribe to channel
    const channel = pusherRef.current.subscribe(channelName);
    channelRef.current = channel;

    // Bind event listener
    channel.bind(eventName, onEvent);

    return () => {
      channel.unbind(eventName, onEvent);
      pusherRef.current?.unsubscribe(channelName);
    };
  }, [channelName, eventName, onEvent, enabled]);

  return { pusher: pusherRef.current, channel: channelRef.current };
};
