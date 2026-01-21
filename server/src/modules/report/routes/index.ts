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
  createIncome,
  deleteIncome,
  assignEmployee,
  removeEmployee,
  getReportByShift,
  updateDisposal,
  createReportStockInventory,
  updateReportStockInventory,
  deleteReportStockInventory,
} from '../controller/report.controller';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(createReport));
router.get('/', requireAuth, asyncHandler(getReports));
router.get('/by-shift', requireAuth, asyncHandler(getReportByShift));
router.get('/:reportId', requireAuth, asyncHandler(getReportById));

router.patch('/:reportId/validate', requireAuth, asyncHandler(validateReport));
router.post('/:reportId/submit', requireAuth, asyncHandler(submitReport));

router.post('/:reportId/entries', requireAuth, asyncHandler(createOrUpdateEntry));
router.delete('/:reportId/entries/:entryId', requireAuth, asyncHandler(deleteEntry));

router.post('/:reportId/expenses', requireAuth, asyncHandler(createExpense));
router.delete('/:reportId/expenses/:expenseId', requireAuth, asyncHandler(deleteExpense));

router.post('/:reportId/income', requireAuth, asyncHandler(createIncome));
router.delete('/:reportId/income/:incomeId', requireAuth, asyncHandler(deleteIncome));

router.put('/:reportId/disposals/:disposalId', requireAuth, asyncHandler(updateDisposal));

router.post('/:reportId/employees', requireAuth, asyncHandler(assignEmployee));
router.delete('/:reportId/employees/:userId', requireAuth, asyncHandler(removeEmployee));

router.post('/:reportId/stock-inventories', requireAuth, asyncHandler(createReportStockInventory));
router.put('/:reportId/stock-inventories/:productId', requireAuth, asyncHandler(updateReportStockInventory));
router.delete('/:reportId/stock-inventories/:productId', requireAuth, asyncHandler(deleteReportStockInventory));

export default router;
