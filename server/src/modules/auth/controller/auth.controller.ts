import { NextFunction, Request, Response } from 'express';

import { NotFoundError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import { registerUser as registerUserService } from '../services/register.service';
import { RegisterUserSchema } from '../schema/registerUserSchema';
import { LoginUserSchema } from '../schema/loginUserSchema';
import { loginUser as loginUserService } from '../services/login.service';

const isProduction = process.env.NODE_ENV === 'production';

const validateUserRegister = createSchemaValidator(RegisterUserSchema);
const validateUserLogin = createSchemaValidator(LoginUserSchema);

const getMe = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    if (!user) {
      throw new NotFoundError('User not found');
    }

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

const logoutUser = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
    });

    res.status(200).json({ message: 'Successfully logged out' });
  } catch (err) {
    next(err);
  }
};

export { getMe, loginUser, logoutUser, registerUser };
