import { NextFunction, Request, Response } from 'express';

import { JwtUserPayload, verifyJwt } from '~/utils';
import { UnauthorizedError } from '~/errors/unauthorized.error';

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new UnauthorizedError('Unauthorized. Token is required.');
    }

    const decoded = verifyJwt(token);

    if (!decoded) {
      throw new UnauthorizedError('Unauthorized. Invalid token.');
    }

    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};
