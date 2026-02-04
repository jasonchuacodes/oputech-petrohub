import { Request, Response } from 'express';
import { getTotalIncomeAnalytics } from '../services/analytics.service';
import { getIncomeAnalyticsSchema } from '../schema/getIncomeAnalyticsSchema';

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
