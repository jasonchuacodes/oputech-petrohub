import { prisma } from '~/db';
import { ConflictError } from '~/errors';
import { generateHash } from '~/utils';

import { UserRegisterInput } from '../schema/registerSchema';

const validatePassword = (password: string, confirmation: string) => {
    if (password !== confirmation) {
        throw new ConflictError('Passwords do not match');
    }
};

const registerUser = async (data: UserRegisterInput) => {
    const { name, email, password, confirmPassword, username, role } = data;

    validatePassword(password, confirmPassword);

    const hash = await generateHash(password);

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
            password: hash,
            username,
            role,
        },
    });
};

export { registerUser };
