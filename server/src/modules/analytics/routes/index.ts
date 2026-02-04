import { Router } from 'express';
import { requireAuth } from '~/middlewares/requireAuth';
import { asyncHandler } from '~/utils/async-handler';
import { getIncomeAnalytics, getExpenseAnalytics, getDisposalAnalytics } from '../controller/analytics.controller';

const router = Router();

router.get('/income', requireAuth, asyncHandler(getIncomeAnalytics));
router.get('/expenses', requireAuth, asyncHandler(getExpenseAnalytics));
router.get('/disposals', requireAuth, asyncHandler(getDisposalAnalytics));

export default router;
