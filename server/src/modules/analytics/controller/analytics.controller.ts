import { Request, Response } from 'express';
import { getTotalIncomeAnalytics, getTotalExpenseAnalytics } from '../services/analytics.service';
import { getIncomeAnalyticsSchema } from '../schema/getIncomeAnalyticsSchema';
import { getExpenseAnalyticsSchema } from '../schema/getExpenseAnalyticsSchema';

export const getIncomeAnalytics = async (req: Request, res: Response) => {
  const { tenantId, startDate, endDate } = getIncomeAnalyticsSchema.parse(req.query);

  const data = await getTotalIncomeAnalytics({
    tenantId,
    startDate,
    endDate,
  });

  res.status(200).json({
    message: 'Income analytics retrieved successfully',
    data,
  });
};

export const getExpenseAnalytics = async (req: Request, res: Response) => {
  const { tenantId, startDate, endDate } = getExpenseAnalyticsSchema.parse(req.query);

  const data = await getTotalExpenseAnalytics({
    tenantId,
    startDate,
    endDate,
  });

  res.status(200).json({
    message: 'Expense analytics retrieved successfully',
    data,
  });
};
