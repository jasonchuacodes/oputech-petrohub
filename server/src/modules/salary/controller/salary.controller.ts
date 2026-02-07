import type { Response, NextFunction } from 'express';

import { Role } from '~/db/prisma';
import { ForbiddenError, UnauthorizedError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import { CreateSalaryRateSchema } from '../schema/createSalaryRateSchema';
import { GetSalaryRateSchema } from '../schema/getSalaryRateSchema';
import * as salaryService from '../services/salary.service';

const validateCreateSalaryRate = createSchemaValidator(CreateSalaryRateSchema);
const validateGetSalaryRate = createSchemaValidator(GetSalaryRateSchema);

const createSalaryRate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Only admins can create salary rates
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can manage salary rates');
    }

    const data = await validateCreateSalaryRate(req.body);

    const salaryRate = await salaryService.createSalaryRate({
      userId: data.userId,
      tenantId: data.tenantId,
      rate: data.rate,
      rateType: data.rateType,
      effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : undefined,
    });

    res.status(201).json({ message: 'Salary rate created successfully', data: salaryRate });
  } catch (err) {
    next(err);
  }
};

const getCurrentSalaryRate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await validateGetSalaryRate(req.query);

    // Users can only view their own rates, admins can view any
    if (req.user!.role !== Role.ADMIN && data.userId !== req.user!.id) {
      throw new ForbiddenError('Cannot view other users salary rates');
    }

    const salaryRate = await salaryService.getCurrentSalaryRate(data.userId, data.tenantId);

    if (!salaryRate) {
      res.status(404).json({ message: 'No salary rate configured for this user' });
      return;
    }

    res.status(200).json({ data: salaryRate });
  } catch (err) {
    next(err);
  }
};

const getSalaryRates = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await validateGetSalaryRate(req.query);

    // Users can only view their own rates, admins can view any
    if (req.user!.role !== Role.ADMIN && data.userId !== req.user!.id) {
      throw new ForbiddenError('Cannot view other users salary rates');
    }

    const salaryRates = await salaryService.getSalaryRates(data.userId, data.tenantId);

    res.status(200).json({ data: salaryRates });
  } catch (err) {
    next(err);
  }
};

export { createSalaryRate, getCurrentSalaryRate, getSalaryRates };
