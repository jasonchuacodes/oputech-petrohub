import { prisma } from '~/db';
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

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const userData: CreateUserInput = {
    name,
    password: hash,
    username,
    role,
  };

  if (email) {
    userData.email = email;
  }

  return await prisma.user.create({ data: userData });
};

export { registerUser };
