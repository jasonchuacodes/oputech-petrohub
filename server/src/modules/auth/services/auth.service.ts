import { prisma } from '~/db';
import { BadInputError } from '~/errors';
import { generateHash, verify } from '~/utils';

import { UpdatePasswordInput } from '../schema/updatePasswordSchema';

const updatePassword = async (data: UpdatePasswordInput) => {
  const { id: userId, oldPassword, newPassword } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      password: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isOldPasswordValid = await verify(oldPassword, user.password);

  if (!isOldPasswordValid) {
    throw new BadInputError('The current password you entered is incorrect. Please try again.');
  }

  const newPasswordHash = await generateHash(newPassword);

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: newPasswordHash,
    },
  });
};

export { updatePassword };
