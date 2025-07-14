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
      message: 'Successfully retrieved authenticated user',
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

    const user = await registerUserService(data);

    res.status(200).json({ message: 'Registered successfully', data: { user } });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await validateUserLogin(req.body);

    const { user, accessToken, refreshToken } = await loginUserService(data);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 5 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1 * 60 * 1000,
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
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
    });

    res.clearCookie('refreshToken', {
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
