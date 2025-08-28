import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import {
  createTimesheet,
  getTimesheetById,
  getUserTimesheets,
  checkIn,
  checkOut,
} from '../controller/timesheet.controller';

const router = express.Router();

// Public routes

// Private routes
router.post('/create', requireAuth, asyncHandler(createTimesheet));
router.get('/:timesheetId', requireAuth, asyncHandler(getTimesheetById));
router.get('/', requireAuth, asyncHandler(getUserTimesheets));
router.post('/check-in', requireAuth, asyncHandler(checkIn));
router.post('/check-out', requireAuth, asyncHandler(checkOut));

export default router;
