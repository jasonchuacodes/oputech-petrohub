import { prisma } from '~/db';
import { UnauthenticatedError } from '~/errors/unauthenticated.error';
import { REFRESH_TOKEN_EXPIRY_IN_DAYS } from '~/shared/constants';
import { verify, signJwt, JwtSessionPayload, JwtUserPayload } from '~/utils';

import { LoginUserInput } from '../schema/loginUserSchema';

const loginUser = async (data: LoginUserInput) => {
  const { password, username } = data;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new UnauthenticatedError('Invalid username or password');
  }

  const isValidPassword = await verify(password, user.password);

  if (!isValidPassword) {
    throw new UnauthenticatedError('Invalid username or password');
  }

  const accessToken = signJwt<JwtUserPayload>({
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    role: user.role,
    shouldChangePassword: user.shouldChangePassword,
  });

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_IN_DAYS * 24 * 60 * 60 * 1000);

  const { id: sessionId } = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt,
    },
  });

  const refreshToken = signJwt<JwtSessionPayload>({ sessionId });

  return { user, accessToken, refreshToken };
};

export { loginUser };
