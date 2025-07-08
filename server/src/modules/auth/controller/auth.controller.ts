import { NextFunction, Request, Response } from 'express';

import { createSchemaValidator } from '~/utils';

import { registerUser as registerUserService } from '../services/register.service';
import { userRegisterSchema } from '../schema/registerSchema';
import { loginUser as loginUserService } from '../services/login.service';
import { userLoginSchema } from '../schema/loginSchema';
import { AuthenticatedRequest } from '../../../middlewares';
import { NotFoundError } from '../../../errors';

const validateUserRegister = createSchemaValidator(userRegisterSchema);
const validateUserLogin = createSchemaValidator(userLoginSchema);

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await validateUserRegister(req.body);

    await registerUserService(data);

    res.status(200).json({ message: 'Registered successfully' });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await validateUserLogin(req.body);

    const { user, token } = await loginUserService(data);

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
    next(err);
  }
};

const getMe = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    console.log('Request: ', req);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export { registerUser, loginUser, getMe };
