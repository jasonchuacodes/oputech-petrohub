import type { Response, NextFunction } from 'express';
import { z } from 'zod';

import { Role } from '~/db/prisma';
import { NotFoundError, UnauthorizedError } from '~/errors';
import { AuthenticatedRequest } from '~/middlewares';
import { createSchemaValidator } from '~/utils';

import { GetUnprocessedTimesheetsSchema } from '../schema/getUnprocessedTimesheetsSchema';
import { RunPayrollSchema } from '../schema/runPayrollSchema';
import * as payrollService from '../services/payroll.service';

const validateGetUnprocessedTimesheets = createSchemaValidator(GetUnprocessedTimesheetsSchema);
const validateRunPayroll = createSchemaValidator(RunPayrollSchema);

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

const runPayroll = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can run payroll');
    }

    const data = await validateRunPayroll(req.body);

    const payrollRun = await payrollService.runPayroll({
      tenantId: data.tenantId,
      periodType: data.periodType,
      periodStart: new Date(data.periodStart),
      periodEnd: new Date(data.periodEnd),
      payslips: data.payslips.map((p) => ({
        userId: p.userId,
        timesheetIds: p.timesheetIds,
        totalHours: p.totalHours,
        rateSnapshot: p.rateSnapshot,
        rateTypeSnapshot: p.rateTypeSnapshot,
        totalCompensation: p.totalCompensation,
        notes: p.notes,
      })),
      notes: data.notes,
      createdBy: req.user!.id,
    });

    res.status(201).json({ data: payrollRun });
  } catch (err) {
    next(err);
  }
};

const getPayrollRuns = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can access payroll');
    }

    const { tenantId, periodStart, periodEnd } = req.query;

    const payrollRuns = await payrollService.getPayrollRuns({
      tenantId: tenantId as string,
      periodStart: periodStart ? new Date(periodStart as string) : undefined,
      periodEnd: periodEnd ? new Date(periodEnd as string) : undefined,
    });

    res.status(200).json({ data: payrollRuns });
  } catch (err) {
    next(err);
  }
};

const getPayrollRunById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can access payroll');
    }

    const { payrollRunId } = req.params;

    const payrollRun = await payrollService.getPayrollRunById(payrollRunId);

    if (!payrollRun) {
      throw new NotFoundError('PayrollRun not found');
    }

    res.status(200).json({ data: payrollRun });
  } catch (err) {
    next(err);
  }
};

const MarkPayslipAsPaidSchema = z.object({
  paidAt: z.string().datetime().optional(),
  paymentMethod: z.string().optional(),
  paymentNotes: z.string().optional(),
});

const validateMarkPayslipAsPaid = createSchemaValidator(MarkPayslipAsPaidSchema);

const markPayslipAsPaid = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can mark payslips as paid');
    }

    const { payslipId } = req.params;
    const data = await validateMarkPayslipAsPaid(req.body);

    const payslip = await payrollService.markPayslipAsPaid({
      payslipId,
      paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
      paymentMethod: data.paymentMethod,
      paymentNotes: data.paymentNotes,
    });

    res.status(200).json({ data: payslip });
  } catch (err) {
    next(err);
  }
};

const cancelPayrollRun = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can cancel payroll runs');
    }

    const { payrollRunId } = req.params;

    const payrollRun = await payrollService.cancelPayrollRun(payrollRunId);

    res.status(200).json({ data: payrollRun });
  } catch (err) {
    next(err);
  }
};

const GeneratePayslipSchema = z.object({
  tenantId: z.string().uuid(),
  userId: z.string().uuid(),
  timesheetIds: z.array(z.string().uuid()),
  periodType: z.enum(['WEEKLY']),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  totalHours: z.number().min(0),
  rateSnapshot: z.string(),
  rateTypeSnapshot: z.enum(['HOURLY', 'DAILY']),
  totalCompensation: z.string(),
  payrollRunId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

const validateGeneratePayslip = createSchemaValidator(GeneratePayslipSchema);

const generatePayslip = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can generate payslips');
    }

    const data = await validateGeneratePayslip(req.body);

    const payslip = await payrollService.generatePayslip({
      tenantId: data.tenantId,
      userId: data.userId,
      timesheetIds: data.timesheetIds,
      periodType: data.periodType,
      periodStart: new Date(data.periodStart),
      periodEnd: new Date(data.periodEnd),
      totalHours: data.totalHours,
      rateSnapshot: data.rateSnapshot,
      rateTypeSnapshot: data.rateTypeSnapshot,
      totalCompensation: data.totalCompensation,
      payrollRunId: data.payrollRunId,
      notes: data.notes,
      createdBy: req.user!.id,
    });

    res.status(201).json({ data: payslip });
  } catch (err) {
    next(err);
  }
};

const getPayslips = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== Role.ADMIN) {
      throw new UnauthorizedError('Only administrators can access payslips');
    }

    const { tenantId, userId, periodStart, periodEnd } = req.query;

    const payslips = await payrollService.getPayslips({
      tenantId: tenantId as string,
      userId: userId as string | undefined,
      periodStart: periodStart ? new Date(periodStart as string) : undefined,
      periodEnd: periodEnd ? new Date(periodEnd as string) : undefined,
    });

    res.status(200).json({ data: payslips });
  } catch (err) {
    next(err);
  }
};

export {
  getUnprocessedTimesheets,
  runPayroll,
  getPayrollRuns,
  getPayrollRunById,
  markPayslipAsPaid,
  cancelPayrollRun,
  generatePayslip,
  getPayslips,
};
