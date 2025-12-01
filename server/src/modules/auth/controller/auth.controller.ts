import { NextFunction, Request, Response } from 'express';

import { isProduction } from '~/config/environment';
import { Role } from '~/db/prisma';
import { ForbiddenError, NotFoundError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { getUserById as getUserService } from '~/modules/user/services/user.service';
import { REFRESH_TOKEN_EXPIRY_IN_DAYS } from '~/shared/constants';
import { createSchemaValidator } from '~/utils';

import { registerUser as registerUserService } from '../services/register.service';
import { RegisterUserSchema } from '../schema/registerUserSchema';
import { LoginUserSchema } from '../schema/loginUserSchema';
import { UpdatePasswordSchema } from '../schema/updatePasswordSchema';
import {
  forceUpdatePassword as forceUpdatePasswordService,
  updatePassword as updatePasswordService,
} from '../services/auth.service';
import { loginUser as loginUserService } from '../services/login.service';
import { logoutSession } from '../services/logout.service';
import { ForceUpdatePasswordSchema } from '../schema/forceUpdatePasswordSchema';

const validateUserRegister = createSchemaValidator(RegisterUserSchema);
const validateUserLogin = createSchemaValidator(LoginUserSchema);
const validateUpdatePassword = createSchemaValidator(UpdatePasswordSchema);
const validateForceUpdatePassword = createSchemaValidator(ForceUpdatePasswordSchema);

const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const user = await getUserService(userId);

    const authUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      hasTenant: user.tenants.length > 0,
      role: user.role,
      shouldChangePassword: user.shouldChangePassword,

      tenants: user.tenants.map(({ tenant }) => ({
        id: tenant.id,
        name: tenant.name,
      })),
    };

    res.status(200).json({
      message: 'Successfully retrieved authenticated user',
      data: {
        user: authUserData,
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
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRY_IN_DAYS * 24 * 60 * 60 * 1000,
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

const logoutUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await logoutSession(refreshToken);
    }

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

const updatePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let targetUserId: string;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const { id, oldPassword, newPassword } = await validateUpdatePassword(req.body);

    if (userRole === Role.ADMIN) {
      targetUserId = id ?? userId;
    } else {
      if (id && id !== userId) {
        throw new ForbiddenError('You cannot change the password of another user');
      }

      targetUserId = userId;
    }

    await updatePasswordService({
      newPassword: newPassword,
      oldPassword: oldPassword,
      id: targetUserId,
    });

    res.status(200).json({ message: 'Successfully updated password' });
  } catch (err) {
    next(err);
  }
};

const forceUpdatePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user!.id;

  try {
    const { newPassword } = await validateForceUpdatePassword(req.body);

    await forceUpdatePasswordService({
      id: userId,
      newPassword: newPassword,
    });

    res.status(200).json({ message: 'Successfully updated password' });
  } catch (err) {
    next(err);
  }
};

export { getMe, loginUser, logoutUser, registerUser, updatePassword, forceUpdatePassword };
