import { prisma } from '~/db/index';
import { ConflictError, NotFoundError } from '~/errors';

import { CreateUserInput } from '../schema/createUserSchema';
import { UpdateUserPayload } from '../schema/updateUserSchema';

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

const getAllUsers = () => prisma.user.findMany();

const getUsersByTenantId = (tenantId: string) =>
  prisma.user.findMany({
    where: {
      tenants: {
        some: { tenantId },
      },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id },
    include: {
      tenants: {
        include: {
          tenant: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

const updateUser = async (id: string, data: UpdateUserPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
  });

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  await prisma.user.delete({
    where: { id },
  });
};

export {
  createUser,
  getAllUsers,
  getUsersByTenantId,
  getUserById,
  updateUser,
  deleteUser,
};
