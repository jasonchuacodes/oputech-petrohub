import { NextFunction, Request, Response } from 'express';

import { JwtSessionPayload, JwtUserPayload, signJwt, verifyJwt } from '~/utils';
import { UnauthorizedError, ForbiddenError } from '~/errors';
import { isProduction } from '~/config/environment';
import { prisma } from '../db';
import { REFRESH_TOKEN_EXPIRY_IN_DAYS } from '~/shared/constants';

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = REFRESH_TOKEN_EXPIRY_IN_DAYS * 24 * 60 * 60 * 1000; // 30 days

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
    const newAccessToken = signJwt<JwtUserPayload>({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      username: session.user.username,
      role: session.user.role,
      shouldChangePassword: session.user.shouldChangePassword,
    });
    const newRefreshToken = signJwt<JwtSessionPayload>({ sessionId });

    // Extend session expiry (sliding expiration)
    const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE);
    await prisma.session.update({
      where: { id: sessionId },
      data: { expiresAt: newExpiresAt },
    });

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      username: session.user.username,
      role: session.user.role,
      shouldChangePassword: session.user.shouldChangePassword,
    };

    return next();
  } catch (err) {
    next(err);
  }
};
