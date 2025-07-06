import { Request, Response } from 'express';

import { BadInputError, ConflictError, UnauthenticatedError } from '~/errors';
import { createSchemaValidator } from '~/utils/schema-validator';

import { registerUser } from '../services/register.service';
import { userRegisterSchema } from '../schema/registerSchema';
import { loginUser } from '../services/login.service';
import { userLoginSchema } from '../schema/loginSchema';

const validateUserRegister = createSchemaValidator(userRegisterSchema);
const validateUserLogin = createSchemaValidator(userLoginSchema);

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

const login = async (req: Request, res: Response) => {
  try {
    const data = await validateUserLogin(req.body);

    const { user, token } = await loginUser(data);

    res.cookie('token', token, {
      httpOnly: true,
    });

    res.status(200).json({
      message: 'Logged in successfully',
      data: {
        user,
      },
    });
  } catch (err) {
    if (err instanceof BadInputError) {
      return res.status(400).json({ errors: err.fieldErrors });
    }

    if (err instanceof UnauthenticatedError) {
      return res.status(400).json({ errors: err.message });
    }

    res.status(500).json({ message: 'Something went wrong' });
  }
};

export { register, login };
