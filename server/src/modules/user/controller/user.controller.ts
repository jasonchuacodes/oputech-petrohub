import { Request, Response } from 'express';
import * as userService from '../services/user.service';

const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, role } = req.body;

        const user = await userService.createUser({ name, email, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create user',
            error,
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
