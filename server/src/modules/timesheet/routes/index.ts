import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { createTimesheet } from '../controller/timesheet.controller';

const router = express.Router();

// Public routes

// Private routes
router.post('/create', requireAuth, asyncHandler(createTimesheet));

export default router;
