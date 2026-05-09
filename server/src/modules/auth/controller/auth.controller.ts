import { NextFunction, Request, Response } from 'express';

import { isProduction } from '~/config/environment';
import { Role, NotificationType, Prisma } from '~/db/prisma';
import { ForbiddenError, NotFoundError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { REFRESH_TOKEN_EXPIRY_IN_DAYS } from '~/shared/constants';
import { createSchemaValidator } from '~/utils';

import * as authService from '~/modules/auth/services/auth.service';
import * as loginService from '~/modules/auth/services/login.service';
import * as logoutService from '~/modules/auth/services/logout.service';
import * as registerService from '~/modules/auth/services/register.service';
import * as notificationService from '~/modules/notification/services/notification.service';
import * as userService from '~/modules/user/services/user.service';
import { ForgotPasswordSchema } from '~/modules/notification/schema/forgotPasswordSchema';
import { prisma } from '~/db/index';

import { RegisterUserSchema } from '../schema/registerUserSchema';
import { LoginUserSchema } from '../schema/loginUserSchema';
import { UpdatePasswordSchema } from '../schema/updatePasswordSchema';
import { ForceUpdatePasswordSchema } from '../schema/forceUpdatePasswordSchema';

const validateUserRegister = createSchemaValidator(RegisterUserSchema);
const validateUserLogin = createSchemaValidator(LoginUserSchema);
const validateUpdatePassword = createSchemaValidator(UpdatePasswordSchema);
const validateForceUpdatePassword = createSchemaValidator(ForceUpdatePasswordSchema);
const validateForgotPassword = createSchemaValidator(ForgotPasswordSchema);

const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const user = await userService.getUserById(userId);

    const authUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      hasTenant: user.tenants.length > 0,
      role: user.role,
      shouldChangePassword: user.shouldChangePassword,
      ...(user.role === Role.USER && { tenantId: user.tenants[0]?.tenant?.id }),

      tenants: user.tenants.map(({ tenant }) => ({
        id: tenant.id,
        name: tenant.name,
      })),
      lastTenantId: user.lastTenantId ?? null,
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

    const user = await registerService.registerUser(data);

    res.status(200).json({ message: 'Registered successfully', data: { user } });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await validateUserLogin(req.body);

    const { user, accessToken, refreshToken } = await loginService.loginUser(data);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
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
      await logoutService.logoutSession(refreshToken);
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
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

    await authService.updatePassword({
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

    await authService.forceUpdatePassword({
      id: userId,
      newPassword: newPassword,
    });

    res.status(200).json({ message: 'Successfully updated password' });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = await validateForgotPassword(req.body);
    const user = await userService.getUserByUsername(username);

    const userTenants = await prisma.tenantsOnUsers.findMany({
      where: { userId: user.id },
      select: { tenantId: true },
    });

    const tenantIds = userTenants.map((t) => t.tenantId);

    const admins = await prisma.user.findMany({
      where: {
        role: Role.ADMIN,
        tenants: {
          some: {
            tenantId: { in: tenantIds },
          },
        },
      },
      select: { id: true },
    });

    const recipientIds = admins.map((admin) => admin.id);

    await notificationService.createNotification(
      NotificationType.PASSWORD_RESET_REQUEST,
      {
        userId: user.id,
        username: user.username,
        requestedAt: new Date().toISOString(),
      },
      recipientIds,
    );

    res.status(200).json({
      message: 'We have notified the admin of your request for password reset',
    });
  } catch (err) {
    next(err);
  }
};

const updateLastTenant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new NotFoundError('User not found');
    }

    const { tenantId } = req.body as { tenantId: string };
    if (!tenantId) {
      throw new Error('tenantId is required');
    }

    await userService.updateLastTenant(userId, tenantId);

    res.status(200).json({ message: 'Last tenant updated' });
  } catch (err) {
    next(err);
  }
};

export {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  updatePassword,
  forceUpdatePassword,
  forgotPassword,
  updateLastTenant,
};
