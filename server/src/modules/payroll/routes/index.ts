import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import {
  getUnprocessedTimesheets,
  runPayroll,
  getPayrollRuns,
  getPayrollRunById,
  markPayslipAsPaid,
  cancelPayrollRun,
  generatePayslip,
  getPayslips,
} from '../controller/payroll.controller';

const router = express.Router();

// Timesheet routes
router.get('/timesheets/unprocessed', requireAuth, asyncHandler(getUnprocessedTimesheets));

// PayrollRun routes
router.post('/run', requireAuth, asyncHandler(runPayroll));
router.get('/runs', requireAuth, asyncHandler(getPayrollRuns));
router.get('/runs/:payrollRunId', requireAuth, asyncHandler(getPayrollRunById));
router.patch('/runs/:payrollRunId/cancel', requireAuth, asyncHandler(cancelPayrollRun));

// Payslip routes
router.post('/payslips', requireAuth, asyncHandler(generatePayslip));
router.get('/payslips', requireAuth, asyncHandler(getPayslips));
router.patch('/payslips/:payslipId/mark-paid', requireAuth, asyncHandler(markPayslipAsPaid));

export default router;
