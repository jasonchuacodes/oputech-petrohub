import { NextFunction, Request, Response } from 'express';

import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import * as userService from '../services/user.service';
import { CreateUserSchema } from '../schema/createUserSchema';

const validateCreateUser = createSchemaValidator(CreateUserSchema);

const createUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await validateCreateUser({ ...req.body, password: 'Password123!' });

    const { password, ...user } = await userService.createUser({ ...data });

    res.status(201).json({ message: 'User created successfully', data: user });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
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

    const user = await userService.getUserById(id);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export { createUser, getAllUsers, getUserById };
