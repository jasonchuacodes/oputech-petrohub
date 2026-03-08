import { startOfHour } from 'date-fns';
import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';
import { NotFoundError } from '~/errors';

export const deaggregateReportInventorySales = async (reportId: string): Promise<void> => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { inventories: true },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  const hourlyGroups = new Map<string, { amount: Decimal; count: number }>();

  for (const inventory of report.inventories) {
    const hourBucket = startOfHour(inventory.createdAt);
    const key = hourBucket.toISOString();

    const existing = hourlyGroups.get(key);
    if (existing) {
      existing.amount = new Decimal(existing.amount).add(inventory.amount);
      existing.count += 1;
    } else {
      hourlyGroups.set(key, { amount: new Decimal(inventory.amount), count: 1 });
    }
  }

  for (const [hourKey, data] of hourlyGroups) {
    const hourBucket = new Date(hourKey);

    const whereUnique = {
      tenantId_hourBucket: {
        tenantId: report.tenantId,
        hourBucket,
      },
    };

    await prisma.reportInventorySalesAggregation.update({
      where: whereUnique,
      data: {
        totalAmount: { decrement: data.amount },
        inventorySalesCount: { decrement: data.count },
      },
    });

    const updated = await prisma.reportInventorySalesAggregation.findUnique({
      where: whereUnique,
    });

    if (updated && updated.inventorySalesCount <= 0) {
      await prisma.reportInventorySalesAggregation.delete({
        where: whereUnique,
      });
    }
  }
};

export const aggregateReportInventorySales = async (reportId: string): Promise<void> => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { inventories: true },
  });

  if (!report) {
    throw new Error('Report not found');
  }

  // Group inventory sales by hour bucket
  const hourlyGroups = new Map<string, { amount: Decimal; count: number }>();

  for (const inventory of report.inventories) {
    const hourBucket = startOfHour(inventory.createdAt);
    const key = hourBucket.toISOString();

    const existing = hourlyGroups.get(key);
    if (existing) {
      existing.amount = new Decimal(existing.amount).add(inventory.amount);
      existing.count += 1;
    } else {
      hourlyGroups.set(key, { amount: new Decimal(inventory.amount), count: 1 });
    }
  }

  // Upsert each hour bucket atomically
  for (const [hourKey, data] of hourlyGroups) {
    const hourBucket = new Date(hourKey);

    await prisma.reportInventorySalesAggregation.upsert({
      where: {
        tenantId_hourBucket: {
          tenantId: report.tenantId,
          hourBucket,
        },
      },
      update: {
        totalAmount: { increment: data.amount },
        inventorySalesCount: { increment: data.count },
      },
      create: {
        tenantId: report.tenantId,
        hourBucket,
        totalAmount: data.amount,
        inventorySalesCount: data.count,
      },
    });
  }
};
