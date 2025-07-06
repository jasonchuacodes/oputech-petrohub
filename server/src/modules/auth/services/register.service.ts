import { prisma } from '~/db';
import { ConflictError } from '~/errors';

import { UserRegisterInput } from '../schema/registerSchema';

const validatePassword = (password: string, confirmation: string) => {
    if (password !== confirmation) {
        throw new Error('Passwords do not match');
    }
};

const registerUser = async (data: UserRegisterInput) => {
    const { name, email, password, confirmPassword, username, role } = data;

    validatePassword(password, confirmPassword);

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
            password,
            username,
            role,
        },
    });
};

export { registerUser };
