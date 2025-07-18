import { prisma } from '~/db/index';
import { ConflictError, NotFoundError } from '~/errors';

import { CreateUserInput } from '../schema/createUserSchema';

const createUser = async (data: CreateUserInput) => {
  const { email } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  return await prisma.user.create({ data });
};

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUserById = async (id: number) => {
  const user = await prisma.user.findFirst({ where: { id } });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

export { createUser, getAllUsers, getUserById };
