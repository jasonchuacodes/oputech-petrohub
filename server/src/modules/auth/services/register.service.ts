import { prisma } from '~/db';
import { Prisma } from '~/db/prisma';
import { ConflictError } from '~/errors';
import { generateHash } from '~/utils';

import { RegisterUserInput } from '../schema/registerUserSchema';
import { CreateUserInput } from '../../user/schema/createUserSchema';

const validatePassword = (password: string, confirmation: string) => {
  if (password !== confirmation) {
    throw new ConflictError('Passwords do not match');
  }
};

const registerUser = async (data: RegisterUserInput) => {
  const { name, email, password, confirmPassword, username, role } = data;

  validatePassword(password, confirmPassword);

  const hash = await generateHash(password);

  const userData: CreateUserInput = {
    name,
    password: hash,
    username,
    role,
  };

  if (email) {
    userData.email = email;
  }

  try {
    return await prisma.user.create({ data: userData });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const fields = (err.meta?.target as string[]) ?? [];

      if (fields.includes('username')) {
        throw new ConflictError('Username is already taken');
      }
      if (fields.includes('email')) {
        throw new ConflictError('Email is already registered');
      }

      throw new ConflictError('User already exists');
    }
    throw err;
  }
};

export { registerUser };
