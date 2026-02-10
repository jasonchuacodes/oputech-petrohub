import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { getUnprocessedTimesheets } from '../controller/payroll.controller';

const router = express.Router();

router.get('/timesheets/unprocessed', requireAuth, asyncHandler(getUnprocessedTimesheets));

export default router;
