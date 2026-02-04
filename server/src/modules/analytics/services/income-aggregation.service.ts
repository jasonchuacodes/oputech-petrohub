import { startOfHour } from 'date-fns';
import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';

export const aggregateReportIncome = async (reportId: string): Promise<void> => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { income: true }
  });

  if (!report) {
    throw new Error('Report not found');
  }

  // Group income by hour bucket
  const hourlyGroups = new Map<string, { amount: Decimal; count: number }>();

  for (const income of report.income) {
    const hourBucket = startOfHour(income.createdAt);
    const key = hourBucket.toISOString();

    const existing = hourlyGroups.get(key);
    if (existing) {
      existing.amount = new Decimal(existing.amount).add(income.amount);
      existing.count += 1;
    } else {
      hourlyGroups.set(key, { amount: new Decimal(income.amount), count: 1 });
    }
  }

  // Upsert each hour bucket atomically
  for (const [hourKey, data] of hourlyGroups) {
    const hourBucket = new Date(hourKey);

    await prisma.reportIncomeAggregation.upsert({
      where: {
        tenantId_hourBucket: {
          tenantId: report.tenantId,
          hourBucket
        }
      },
      update: {
        totalAmount: { increment: data.amount },
        incomeCount: { increment: data.count },
      },
      create: {
        tenantId: report.tenantId,
        hourBucket,
        totalAmount: data.amount,
        incomeCount: data.count,
      },
    });
  }
};
