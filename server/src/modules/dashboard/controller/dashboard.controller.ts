import { NextFunction, Response } from 'express';

import { Role } from '~/db/prisma';
import { UnauthorizedError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';

import { getDashboardData as getDashboardDataService } from '../services/dashboard.service';

const getDashboardData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userRole = req.user?.role;

    const tenantId = req.query.tenantId as string;

    if (userRole !== Role.ADMIN) {
      throw new UnauthorizedError(
        'Unauthorized. You do not have permissions fetch dashboard data.',
      );
    }

    const dashboardData = await getDashboardDataService({ tenantId });

    res.status(201).json({
      message: 'Successfully retrieved dashboard data',
      data: { dashboardData },
    });
  } catch (err) {
    next(err);
  }
};

export { getDashboardData };
