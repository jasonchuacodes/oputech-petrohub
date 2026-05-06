import { Router } from 'express';
import { requireAuth } from '~/middlewares/requireAuth';
import { asyncHandler } from '~/utils/async-handler';
import { getIncomeAnalytics, getExpenseAnalytics, getDisposalAnalytics, getInventorySalesAnalytics } from '../controller/analytics.controller';

const router = Router();

router.get('/income', requireAuth, asyncHandler(getIncomeAnalytics));
router.get('/expenses', requireAuth, asyncHandler(getExpenseAnalytics));
router.get('/disposals', requireAuth, asyncHandler(getDisposalAnalytics));
router.get('/inventory-sales', requireAuth, asyncHandler(getInventorySalesAnalytics));

export default router;
