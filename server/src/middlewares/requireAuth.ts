import { NextFunction, Request, Response } from 'express';

import {
  generateHash,
  generateToken,
  JwtSessionPayload,
  JwtUserPayload,
  signJwt,
  verifyJwt,
} from '~/utils';
import { UnauthorizedError, ForbiddenError } from '~/errors';
import { prisma } from '../db';

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    // 1. Try to validate access token
    if (accessToken) {
      const decoded = verifyJwt<JwtUserPayload>(accessToken);
      if (decoded) {
        req.user = decoded;
        return next();
      }
    }

    // 2. If accessToken is invalid, try to use refresh token
    if (!refreshToken) {
      throw new UnauthorizedError('Unauthorized. Refresh token is required.');
    }

    const refreshPayload = verifyJwt<JwtSessionPayload>(refreshToken);

    if (!refreshPayload) {
      throw new UnauthorizedError('Unauthorized. Invalid refresh token.');
    }

    const { sessionId } = refreshPayload;

    const session = await prisma.session.findFirst({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      throw new ForbiddenError('Forbidden. Session not found.');
    }

    if (new Date() > session.expiresAt) {
      throw new UnauthorizedError('Unauthorized. Session has expired.');
    }

    // Generate new tokens
    const newAccessToken = signJwt({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    });
    const newRefreshToken = signJwt({ sessionId });

    // 4. Save hashed version of newRefreshToken to the session in DB
    const token = generateToken();
    const refreshTokenHash = await generateHash(token);

    // 5. Update the session's refreshTokenHash
    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        refreshTokenHash,
      },
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: 5 * 1000,
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 15 * 1000,
    });

    req.user = {
      name: session.user.name,
      email: session.user.email,
      username: session.user.username,
    };

    return next();
  } catch (err) {
    next(err);
  }
};
