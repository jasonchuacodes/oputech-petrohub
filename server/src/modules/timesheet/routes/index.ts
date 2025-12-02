import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import {
  createTimesheet,
  getTodayTimesheet,
  getTimesheetById,
  getUserTimesheets,
  getAllTimesheets,
  checkIn,
  checkOut,
  updateTimesheet,
  deleteTimesheet,
  getAttendance,
} from '../controller/timesheet.controller';

const router = express.Router();

// Public routes

// Private routes
router.get('/', requireAuth, asyncHandler(getUserTimesheets));

router.get('/today', requireAuth, asyncHandler(getTodayTimesheet));
router.get('/all', requireAuth, asyncHandler(getAllTimesheets));
router.get('/attendance', requireAuth, asyncHandler(getAttendance));

router.post('/create', requireAuth, asyncHandler(createTimesheet));
router.put('/update', requireAuth, asyncHandler(updateTimesheet));
router.post('/check-in', requireAuth, asyncHandler(checkIn));
router.post('/check-out', requireAuth, asyncHandler(checkOut));

router.get('/:timesheetId', requireAuth, asyncHandler(getTimesheetById));
router.delete('/:timesheetId', requireAuth, asyncHandler(deleteTimesheet));

export default router;
