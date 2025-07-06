import { Request, Response } from 'express';

import { BadInputError, ConflictError } from '~/errors';
import { createSchemaValidator } from '~/utils/schema-validator';

import * as userService from '../services/user.service';
import { createUserSchema } from '../schema/createUserSchema';

const validateCreateUser = createSchemaValidator(createUserSchema);

const createUser = async (req: Request, res: Response) => {
    try {
        const data = await validateCreateUser(req.body);

        await userService.createUser(data);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        if (err instanceof BadInputError) {
            return res.status(400).json({ errors: err.fieldErrors });
        }

        if (err instanceof ConflictError) {
            return res.status(409).json({ message: err.message });
        }
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await userService.getAllUsers();

        res.status(201).json(allUsers);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get users',
            error,
        });
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        const user = await userService.getUserById(id);

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get users',
            error,
        });
    }
};

export { createUser, getAllUsers, getUserById };
