import { Router } from 'express';
import { requireAuth } from '~/middlewares/requireAuth';
import { asyncHandler } from '~/utils/async-handler';
import { getIncomeAnalytics } from '../controller/analytics.controller';

const router = Router();

router.get('/income', requireAuth, asyncHandler(getIncomeAnalytics));

export default router;
