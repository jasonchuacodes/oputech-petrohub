import { prisma } from '~/db/index';
import { ConflictError, NotFoundError } from '~/errors';

import { CreateUserInput } from '../schema/createUserSchema';

const createUser = async (data: CreateUserInput) => {
  const { tenantId, ...userData } = data;

  const existingUser = await prisma.user.findUnique({
    where: { username: userData.username },
  });

  if (existingUser) {
    throw new ConflictError('User with this username already exists');
  }

  return await prisma.user.create({
    data: {
      ...userData,
      tenants: {
        create: {
          tenant: {
            connect: { id: tenantId },
          },
        },
      },
    },
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUserById = async (id: number | string) => {
  const userId = Number(id);

  const user = await prisma.user.findFirst({ where: { id: userId }, include: { tenants: true } });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export { createUser, getAllUsers, getUserById };
