import { NextFunction, Request, Response } from 'express';

import { createSchemaValidator } from '~/utils/schema-validator';
import { AuthenticatedRequest } from '~/middlewares/requireAuth';

import * as reportService from '../services/report.service';
import * as entryService from '../services/entry.service';
import * as expenseService from '../services/expense.service';
import * as employeeService from '../services/employee.service';
import { CreateReportSchema } from '../schema/createReportSchema';
import { GetReportsSchema } from '../schema/getReportsSchema';
import { CreateReportEntrySchema } from '../schema/createReportEntrySchema';
import { CreateExpenseSchema } from '../schema/createExpenseSchema';
import { AssignEmployeeSchema } from '../schema/assignEmployeeSchema';
import { GetReportByShiftSchema } from '../schema/getReportByShiftSchema';

const validateCreateReport = createSchemaValidator(CreateReportSchema);
const validateGetReports = createSchemaValidator(GetReportsSchema);
const validateCreateReportEntry = createSchemaValidator(CreateReportEntrySchema);
const validateCreateExpense = createSchemaValidator(CreateExpenseSchema);
const validateGetReportByShift = createSchemaValidator(GetReportByShiftSchema);
const validateAssignEmployee = createSchemaValidator(AssignEmployeeSchema);

const createReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const data = await validateCreateReport(req.body);
    const report = await reportService.createReport({
      ...data,
      creatorId: req.user!.id,
    });

    res.status(201).json({
      message: 'Report created successfully',
      data: { report },
    });
  } catch (err) {
    next(err);
  }
};

const getReports = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filters = await validateGetReports({
      tenantId: req.query.tenantId as string,
    });

    const reports = await reportService.getReports({
      ...filters,
      userId: req.user!.id,
      userRole: req.user!.role,
    });

    res.status(200).json({
      message: 'Reports retrieved successfully',
      data: { reports },
    });
  } catch (err) {
    next(err);
  }
};

const getReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const report = await reportService.getReportById(reportId);

    res.status(200).json({
      message: 'Report retrieved successfully',
      data: { report },
    });
  } catch (err) {
    next(err);
  }
};

const getReportByShift = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const filters = await validateGetReportByShift({
      tenantId: req.query.tenantId as string,
      shiftId: req.query.shiftId as string,
      shiftDate: req.query.shiftDate as string,
    });

    const report = await reportService.getReportByShift(filters);

    res.status(200).json({
      message: 'Report retrieved successfully',
      data: { report },
    });
  } catch (err) {
    next(err);
  }
};

const validateReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const report = await reportService.validateReport(reportId, req.user!.id);

    res.status(200).json({
      message: 'Report validated successfully',
      data: { report },
    });
  } catch (err) {
    next(err);
  }
};

const submitReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const report = await reportService.submitReport(reportId, req.user!.id);

    res.status(200).json({
      message: 'Report submitted successfully',
      data: { report },
    });
  } catch (err) {
    next(err);
  }
};

const createOrUpdateEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const data = await validateCreateReportEntry(req.body);

    const entry = await entryService.createOrUpdateEntry({
      reportId,
      ...data,
    });

    res.status(201).json({
      message: 'Entry created/updated successfully',
      data: { entry },
    });
  } catch (err) {
    next(err);
  }
};

const deleteEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId, entryId } = req.params;
    await entryService.deleteEntry(entryId, reportId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const createExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const data = await validateCreateExpense(req.body);

    const expense = await expenseService.createExpense({
      reportId,
      ...data,
    });

    res.status(201).json({
      message: 'Expense created successfully',
      data: { expense },
    });
  } catch (err) {
    next(err);
  }
};

const deleteExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId, expenseId } = req.params;
    await expenseService.deleteExpense(expenseId, reportId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const assignEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const data = await validateAssignEmployee(req.body);

    await employeeService.assignEmployee({
      reportId,
      ...data,
    });

    res.status(201).json({
      message: 'Employee assigned successfully',
    });
  } catch (err) {
    next(err);
  }
};

const removeEmployee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId, userId } = req.params;
    await employeeService.removeEmployee(reportId, userId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export {
  createReport,
  getReports,
  getReportById,
  getReportByShift,
  validateReport,
  submitReport,
  createOrUpdateEntry,
  deleteEntry,
  createExpense,
  deleteExpense,
  assignEmployee,
  removeEmployee,
};
