import { Response, NextFunction } from 'express';

import { prisma } from '~/db';
import { ForbiddenError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';

import { pusher } from '../config/pusher';

const authenticateChannel = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const userId = req.user!.id;

    // Handle tenant channel authorization
    if (channel.startsWith('private-tenant-')) {
      const tenantId = channel.replace('private-tenant-', '');

      const membership = await prisma.tenantsOnUsers.findUnique({
        where: {
          userId_tenantId: {
            userId,
            tenantId,
          },
        },
      });

      if (!membership) {
        throw new ForbiddenError('User does not belong to this tenant');
      }

      const authResponse = pusher.authorizeChannel(socketId, channel);
      return res.send(authResponse);
    }

    // Handle user channel authorization (existing logic)
    const expectedChannel = `private-user-${userId}`;
    if (channel !== expectedChannel) {
      throw new ForbiddenError('User can only subscribe to their own channel');
    }

    const authResponse = pusher.authorizeChannel(socketId, channel);
    res.send(authResponse);
  } catch (err) {
    next(err);
  }
};

export { authenticateChannel };
