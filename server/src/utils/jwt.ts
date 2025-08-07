import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { Role } from '../db/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '12h';

export type JwtUserPayload = {
  id: string;
  name: string;
  username: string;
  email: string | null;
  role: Role;
};

export type JwtSessionPayload = {
  sessionId: string;
};

export const signJwt = <T extends object>(payload: T): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyJwt = <T = unknown>(token: string): T | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (err) {
    return null;
  }
};

export const generateToken = () => crypto.randomBytes(64).toString('hex');
