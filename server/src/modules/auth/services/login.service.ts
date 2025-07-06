import { prisma } from '~/db';
import { UnauthenticatedError } from '~/errors/unauthenticated.error';
import { verify } from '~/utils/bcrypt';
import { signJwt } from '~/utils/jwt';

import { UserLoginInput } from '../schema/loginSchema';

const loginUser = async (data: UserLoginInput) => {
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

  const token = signJwt(user);

  return { user, token };
};

export { loginUser };
