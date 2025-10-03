import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { getDashboardData } from '../controller/dashboard.controller';

const router = express.Router();

// Public routes

// Private routes
router.get('/', requireAuth, asyncHandler(getDashboardData));

export default router;
