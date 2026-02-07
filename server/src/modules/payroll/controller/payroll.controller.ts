import type { Response, NextFunction } from 'express';

import { Role } from '~/db/prisma';
import { UnauthorizedError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import { GeneratePayrollSchema } from '../schema/generatePayrollSchema';
import { GetPayrollRecordsSchema } from '../schema/getPayrollSchema';
import { GetUnprocessedTimesheetsSchema } from '../schema/getUnprocessedTimesheetsSchema';
import * as payrollService from '../services/payroll.service';

const validateGetUnprocessedTimesheets = createSchemaValidator(GetUnprocessedTimesheetsSchema);
const validateGeneratePayroll = createSchemaValidator(GeneratePayrollSchema);
const validateGetPayrollRecords = createSchemaValidator(GetPayrollRecordsSchema);

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

const generatePayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Only admins can generate payroll
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can generate payroll');
    }

    const data = await validateGeneratePayroll(req.body);

    const payroll = await payrollService.generatePayroll({
      userId: data.userId,
      tenantId: data.tenantId,
      timesheetIds: data.timesheetIds,
      periodType: data.periodType,
      periodStart: new Date(data.periodStart),
      periodEnd: new Date(data.periodEnd),
      createdBy: req.user!.id,
    });

    res.status(201).json({ message: 'Payroll generated successfully', data: payroll });
  } catch (err) {
    next(err);
  }
};

const getPayrollRecords = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Only admins can access this
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can access payroll');
    }

    const data = await validateGetPayrollRecords(req.query);

    const payrolls = await payrollService.getPayrollRecords({
      tenantId: data.tenantId,
      userId: data.userId,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    });

    res.status(200).json({ data: payrolls });
  } catch (err) {
    next(err);
  }
};

const getPayrollRecord = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Only admins can access this
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can access payroll');
    }

    const { payrollId } = req.params;

    const payroll = await payrollService.getPayrollRecord(payrollId);

    res.status(200).json({ data: payroll });
  } catch (err) {
    next(err);
  }
};

const deletePayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Only admins can delete payroll
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can delete payroll');
    }

    const { payrollId } = req.params;

    const result = await payrollService.deletePayroll(payrollId);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export {
  getUnprocessedTimesheets,
  generatePayroll,
  getPayrollRecords,
  getPayrollRecord,
  deletePayroll,
};
