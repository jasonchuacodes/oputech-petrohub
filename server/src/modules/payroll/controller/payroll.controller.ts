import type { Response, NextFunction } from 'express';

import { Role } from '~/db/prisma';
import { UnauthorizedError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import { GetUnprocessedTimesheetsSchema } from '../schema/getUnprocessedTimesheetsSchema';
import * as payrollService from '../services/payroll.service';

const validateGetUnprocessedTimesheets = createSchemaValidator(GetUnprocessedTimesheetsSchema);

const getUnprocessedTimesheets = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Only admins can access this
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can access payroll');
    }

    const data = await validateGetUnprocessedTimesheets(req.query);

    const timesheets = await payrollService.getUnprocessedTimesheets({
      userId: data.userId,
      tenantId: data.tenantId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });

    res.status(200).json({ data: timesheets });
  } catch (err) {
    next(err);
  }
};

export { getUnprocessedTimesheets };
