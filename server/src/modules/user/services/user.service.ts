import { prisma } from '~/db/index';

import { Role } from '@prisma';

const createUser = async (data: { name: string; role: Role; email: string }) => {
    return prisma.user.create({ data });
};

const getAllUsers = async () => {
    return prisma.user.findMany();
};

const getUserById = async (id: number) => {
    return prisma.user.findFirst({ where: { id } });
};

export { createUser, getAllUsers, getUserById };
