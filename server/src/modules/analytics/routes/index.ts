import { Router } from 'express';
import { requireAuth } from '~/middlewares/requireAuth';
import { asyncHandler } from '~/utils/async-handler';
import { getIncomeAnalytics, getExpenseAnalytics } from '../controller/analytics.controller';

const router = Router();

router.get('/income', requireAuth, asyncHandler(getIncomeAnalytics));
router.get('/expenses', requireAuth, asyncHandler(getExpenseAnalytics));

export default router;
