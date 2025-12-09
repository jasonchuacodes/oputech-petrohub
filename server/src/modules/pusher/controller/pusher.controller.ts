import { Response } from 'express';

import { AuthenticatedRequest } from '~/middlewares';

import { pusher } from '../config/pusher';

const authenticateChannel = (req: AuthenticatedRequest, res: Response) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const userId = req.user!.id;

  // Verify user can only subscribe to their own channel
  const expectedChannel = `private-user-${userId}`;
  if (channel !== expectedChannel) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const authResponse = pusher.authorizeChannel(socketId, channel);
  res.send(authResponse);
};

export { authenticateChannel };
