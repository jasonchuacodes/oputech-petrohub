import { startOfHour } from 'date-fns';
import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';

export const aggregateReportExpense = async (reportId: string): Promise<void> => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { expenses: true }
  });

  if (!report) {
    throw new Error('Report not found');
  }

  // Group expenses by hour bucket
  const hourlyGroups = new Map<string, { amount: Decimal; count: number }>();

  for (const expense of report.expenses) {
    const hourBucket = startOfHour(expense.createdAt);
    const key = hourBucket.toISOString();

    const existing = hourlyGroups.get(key);
    if (existing) {
      existing.amount = new Decimal(existing.amount).add(expense.amount);
      existing.count += 1;
    } else {
      hourlyGroups.set(key, { amount: new Decimal(expense.amount), count: 1 });
    }
  }

  // Upsert each hour bucket atomically
  for (const [hourKey, data] of hourlyGroups) {
    const hourBucket = new Date(hourKey);

    await prisma.reportExpenseAggregation.upsert({
      where: {
        tenantId_hourBucket: {
          tenantId: report.tenantId,
          hourBucket
        }
      },
      update: {
        totalAmount: { increment: data.amount },
        expenseCount: { increment: data.count },
      },
      create: {
        tenantId: report.tenantId,
        hourBucket,
        totalAmount: data.amount,
        expenseCount: data.count,
      },
    });
  }
};
