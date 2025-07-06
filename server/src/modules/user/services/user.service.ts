import { prisma } from '~/db/index';
import { ConflictError } from '~/errors/confict.error';

import { CreateUserInput } from '../schema/createUserSchema';

const createUser = async (data: CreateUserInput) => {
    const { email, name, username, role } = data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ConflictError('User with this email already exists');
    }

    return await prisma.user.create({
        data: {
            email,
            name,
            password: 'password',
            username,
            role,
        },
    });
};

const getAllUsers = async () => {
    return await prisma.user.findMany();
};

const getUserById = async (id: number) => {
    return await prisma.user.findFirst({ where: { id } });
};

export { createUser, getAllUsers, getUserById };
