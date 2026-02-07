import express from 'express';

import { requireAuth } from '~/middlewares';
import { asyncHandler } from '~/utils';

import { createSalaryRate, getCurrentSalaryRate, getSalaryRates } from '../controller/salary.controller';

const router = express.Router();

router.post('/', requireAuth, asyncHandler(createSalaryRate));
router.get('/current', requireAuth, asyncHandler(getCurrentSalaryRate));
router.get('/', requireAuth, asyncHandler(getSalaryRates));

export default router;
