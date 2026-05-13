import { NextFunction, Request, Response } from 'express';

import { createSchemaValidator } from '~/utils/schema-validator';
import { AuthenticatedRequest } from '~/middlewares/requireAuth';

import * as reportService from '../services/report.service';
import * as expenseService from '../services/expense.service';
import * as incomeService from '../services/income.service';
import * as employeeService from '../services/employee.service';
import * as disposalService from '../services/disposal.service';
import * as inventoryService from '../services/inventory.service';
import { CreateReportSchema } from '../schema/createReportSchema';
import { GetReportsSchema } from '../schema/getReportsSchema';
import { CreateExpenseSchema } from '../schema/createExpenseSchema';
import { CreateIncomeSchema } from '../schema/createIncomeSchema';
import { AssignEmployeeSchema } from '../schema/assignEmployeeSchema';
import { GetReportByShiftSchema } from '../schema/getReportByShiftSchema';
import { UpdateDisposalSchema } from '../schema/updateDisposalSchema';
import { CreateReportInventorySchema } from '../schema/createReportInventorySchema';
import { UpdateReportInventorySchema } from '../schema/updateReportInventorySchema';
import { UpdateRemarksSchema } from '../schema/updateRemarksSchema';

const validateCreateReport = createSchemaValidator(CreateReportSchema);
const validateGetReports = createSchemaValidator(GetReportsSchema);
const validateCreateExpense = createSchemaValidator(CreateExpenseSchema);
const validateCreateIncome = createSchemaValidator(CreateIncomeSchema);
const validateGetReportByShift = createSchemaValidator(GetReportByShiftSchema);
const validateAssignEmployee = createSchemaValidator(AssignEmployeeSchema);
const validateUpdateDisposal = createSchemaValidator(UpdateDisposalSchema);
const validateCreateReportInventory = createSchemaValidator(CreateReportInventorySchema);
const validateUpdateReportInventory = createSchemaValidator(UpdateReportInventorySchema);
const validateUpdateRemarks = createSchemaValidator(UpdateRemarksSchema);

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
      shiftDate: req.query.shiftDate as string | undefined,
      status: req.query.status as string | undefined,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      creatorId: req.query.creatorId as string | undefined,
      page: req.query.page as string | undefined,
      pageSize: req.query.pageSize as string | undefined,
    });

    const { reports, total } = await reportService.getReports(filters);

    res.status(200).json({
      message: 'Reports retrieved successfully',
      data: { reports, total },
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
    const report = await reportService.validateReport(reportId, req.user!.id, req.user!.role);

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
    const { remarks } = req.body;
    const report = await reportService.submitReport(
      reportId,
      req.user!.id,
      req.user!.role,
      remarks ?? null,
    );

    res.status(200).json({
      message: 'Report submitted successfully',
      data: { report },
    });
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

const createIncome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const data = await validateCreateIncome(req.body);

    const income = await incomeService.createIncome({
      reportId,
      ...data,
    });

    res.status(201).json({
      message: 'Income created successfully',
      data: { income },
    });
  } catch (err) {
    next(err);
  }
};

const deleteIncome = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId, incomeId } = req.params;
    await incomeService.deleteIncome(incomeId, reportId);

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

const updateDisposal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { reportId, disposalId } = req.params;
    const data = await validateUpdateDisposal(req.body);

    const disposal = await disposalService.updateDisposal({
      reportId,
      disposalId,
      userId: req.user!.id,
      ...data,
    });

    res.status(200).json({
      message: 'Disposal updated successfully',
      data: { disposal },
    });
  } catch (err) {
    next(err);
  }
};

const createReportInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const data = await validateCreateReportInventory(req.body);

    const inventory = await inventoryService.createReportInventory({
      reportId,
      ...data,
    });

    res.status(201).json({
      message: 'inventory entry created successfully',
      data: { inventory },
    });
  } catch (err) {
    next(err);
  }
};

const updateReportInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId, productId } = req.params;
    const data = await validateUpdateReportInventory(req.body);

    const inventory = await inventoryService.updateReportInventory(reportId, productId, data);

    res.status(200).json({
      message: 'Stock inventory entry updated successfully',
      data: { inventory },
    });
  } catch (err) {
    next(err);
  }
};

const deleteReportInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reportId, productId } = req.params;
    await inventoryService.deleteReportInventory(reportId, productId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const updateRemarks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    const { remarks } = await validateUpdateRemarks(req.body);
    const result = await reportService.updateRemarks(reportId, req.user!.id, remarks ?? null);
    res.status(200).json({ message: 'Remarks updated', data: result });
  } catch (err) {
    next(err);
  }
};

const deleteReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { reportId } = req.params;
    await reportService.deleteReport(reportId, req.user!.role);

    res.status(200).json({
      message: 'Report deleted successfully',
    });
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
  updateRemarks,
  createExpense,
  deleteExpense,
  createIncome,
  deleteIncome,
  assignEmployee,
  removeEmployee,
  updateDisposal,
  createReportInventory,
  updateReportInventory,
  deleteReportInventory,
  deleteReport,
};
