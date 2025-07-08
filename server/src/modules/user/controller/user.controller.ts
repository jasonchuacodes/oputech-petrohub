import { NextFunction, Request, Response } from 'express';

import { BadInputError, ConflictError, NotFoundError, UnauthorizedError } from '~/errors';
import { createSchemaValidator } from '~/utils';

import * as userService from '../services/user.service';
import { createUserSchema } from '../schema/createUserSchema';

const validateCreateUser = createSchemaValidator(createUserSchema);

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await validateCreateUser(req.body);

    await userService.createUser(data);

    res.status(201).json({ message: 'User created successfully' });
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
    const { id } = req.body;

    const user = await userService.getUserById(id);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export { createUser, getAllUsers, getUserById };
