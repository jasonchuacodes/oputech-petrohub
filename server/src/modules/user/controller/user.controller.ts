import { NextFunction, Request, Response } from 'express';

import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator, generateHash } from '~/utils';

import * as userService from '../services/user.service';
import { CreateUserSchema } from '../schema/createUserSchema';
import { UpdateUserSchema } from '../schema/updateUserSchema';

const validateCreateUser = createSchemaValidator(CreateUserSchema);
const validateUpdateUser = createSchemaValidator(UpdateUserSchema);

const createUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await validateCreateUser(req.body);

    const hashedPassword = await generateHash(data.password);

    const { password, ...user } = await userService.createUser({
      ...data,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully', data: user });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await userService.getAllUsers();

    res.status(201).json(allUsers);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.query;

    const user = await userService.getUserById(id, tenantId as string | undefined);

    res.status(201).json({
      message: 'Successfully retrieved user details',
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { tenantId } = req.query;

    const data = await validateUpdateUser(req.body);

    const updatedUser = await userService.updateUser(id, data, tenantId as string | undefined);

    res.status(201).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await userService.deleteUser(id);

    res.status(204).json({
      message: 'User deleted',
    });
  } catch (err) {
    next(err);
  }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser };
