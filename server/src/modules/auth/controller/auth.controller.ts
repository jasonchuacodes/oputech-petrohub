import { Request, Response } from 'express';

import { ConflictError, BadInputError } from '~/errors';
import { createSchemaValidator } from '~/utils/schema-validator';

import { registerUser } from '../services/register.service';
import { userRegisterSchema } from '../schema/registerSchema';

const validateUserRegister = createSchemaValidator(userRegisterSchema);

const register = async (req: Request, res: Response) => {
    try {
        const data = await validateUserRegister(req.body);

        await registerUser(data);

        res.status(200).json({ message: 'Registered successfully' });
    } catch (err) {
        if (err instanceof BadInputError) {
            return res.status(400).json({ errors: err.fieldErrors });
        }

        if (err instanceof ConflictError) {
            return res.status(409).json({ errors: err.message });
        }

        res.status(500).json({ message: 'Something went wrong' });
    }
};

const login = async (req: Request, res: Response) => {};

export { register, login };
