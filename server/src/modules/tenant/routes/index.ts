import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { createTenant, getTenants, getTenantUsers } from '../controller/tenant.controller';

const router = express.Router();

// Public routes

// Private routes
router.post('/create', requireAuth, asyncHandler(createTenant));
router.get('/', requireAuth, asyncHandler(getTenants));
router.get('/:tenantId/users', requireAuth, asyncHandler(getTenantUsers));

export default router;
