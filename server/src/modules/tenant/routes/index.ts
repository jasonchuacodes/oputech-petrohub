import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { createTenant } from '../controller/tenant.controller';

const router = express.Router();

// Public routes

// Private routes
router.post('/create', requireAuth, asyncHandler(createTenant));

export default router;
