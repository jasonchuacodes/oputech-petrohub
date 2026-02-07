import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import {
  deletePayroll,
  generatePayroll,
  getPayrollRecord,
  getPayrollRecords,
  getUnprocessedTimesheets,
} from '../controller/payroll.controller';

const router = express.Router();

router.get('/timesheets/unprocessed', requireAuth, asyncHandler(getUnprocessedTimesheets));
router.post('/', requireAuth, asyncHandler(generatePayroll));
router.get('/:payrollId', requireAuth, asyncHandler(getPayrollRecord));
router.get('/', requireAuth, asyncHandler(getPayrollRecords));
router.delete('/:payrollId', requireAuth, asyncHandler(deletePayroll));

export default router;
