import { prisma } from '~/db';
import { UnauthenticatedError } from '~/errors/unauthenticated.error';
import { verify, signJwt, generateToken, generateHash } from '~/utils';

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

  const accessToken = signJwt(user);
  const token = generateToken();
  const refreshTokenHash = await generateHash(token);

  const { id: sessionId } = await prisma.session.create({
    data: {
      refreshTokenHash,
      userId: user.id,
    },
  });

  const refreshToken = signJwt(sessionId);

  return { user, accessToken, refreshToken };
};

export { loginUser };
