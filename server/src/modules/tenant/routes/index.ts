import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import {
  createTenant,
  getTenantById,
  getTenants,
  getTenantUsers,
} from '../controller/tenant.controller';

const router = express.Router();

// Public routes

// Private routes
router.post('/create', requireAuth, asyncHandler(createTenant));
router.get('/', requireAuth, asyncHandler(getTenants));
router.get('/:tenantId/users', requireAuth, asyncHandler(getTenantUsers));
router.get('/:tenantId', requireAuth, asyncHandler(getTenantById));

export default router;
