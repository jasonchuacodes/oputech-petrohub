import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_EXPIRES_IN = '12h';

export type JwtUserPayload = {
  id: number;
  email: string;
};

export const signJwt = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyJwt = (token: string): JwtUserPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
  } catch (err) {
    return null;
  }
};

export const generateToken = () => crypto.randomBytes(64).toString('hex');
