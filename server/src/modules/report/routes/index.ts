import express from 'express';
import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';
import {
  createReport,
  getReports,
  getReportById,
  validateReport,
  submitReport,
  createOrUpdateEntry,
  deleteEntry,
  createExpense,
  deleteExpense,
  assignEmployee,
  removeEmployee,
  getReportByShift,
} from '../controller/report.controller';

const router = express.Router();

// Report routes
router.post('/', requireAuth, asyncHandler(createReport));
router.get('/', requireAuth, asyncHandler(getReports));
router.get('/by-shift', requireAuth, asyncHandler(getReportByShift));
router.get('/:reportId', requireAuth, asyncHandler(getReportById));

router.patch('/:reportId/validate', requireAuth, asyncHandler(validateReport));
router.post('/:reportId/submit', requireAuth, asyncHandler(submitReport));

// Entry routes
router.post('/:reportId/entries', requireAuth, asyncHandler(createOrUpdateEntry));
router.delete('/:reportId/entries/:entryId', requireAuth, asyncHandler(deleteEntry));

// Expense routes
router.post('/:reportId/expenses', requireAuth, asyncHandler(createExpense));
router.delete('/:reportId/expenses/:expenseId', requireAuth, asyncHandler(deleteExpense));

// Employee routes
router.post('/:reportId/employees', requireAuth, asyncHandler(assignEmployee));
router.delete('/:reportId/employees/:userId', requireAuth, asyncHandler(removeEmployee));

export default router;
