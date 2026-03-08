import { startOfHour } from 'date-fns';
import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '~/db';
import { ProductType } from '~/db/prisma';
import { NotFoundError } from '~/errors';

export const deaggregateReportDisposal = async (reportId: string): Promise<void> => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      disposals: {
        include: { product: true }
      }
    }
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  const hourlyGroups = new Map<string, { disposal: Decimal; count: number }>();

  for (const reportDisposal of report.disposals) {
    if (!reportDisposal.product.type) continue;

    const hourBucket = startOfHour(reportDisposal.createdAt);
    const key = `${hourBucket.toISOString()}_${reportDisposal.product.type}`;

    const existing = hourlyGroups.get(key);
    if (existing) {
      existing.disposal = new Decimal(existing.disposal).add(reportDisposal.netDisposal);
      existing.count += 1;
    } else {
      hourlyGroups.set(key, {
        disposal: new Decimal(reportDisposal.netDisposal),
        count: 1
      });
    }
  }

  for (const [compositeKey, data] of hourlyGroups) {
    const [hourKey, productType] = compositeKey.split('_');
    const hourBucket = new Date(hourKey);

    const whereUnique = {
      tenantId_hourBucket_productType: {
        tenantId: report.tenantId,
        hourBucket,
        productType: productType as ProductType
      }
    };

    await prisma.reportDisposalAggregation.update({
      where: whereUnique,
      data: {
        totalDisposal: { decrement: data.disposal },
        disposalCount: { decrement: data.count },
      },
    });

    const updated = await prisma.reportDisposalAggregation.findUnique({
      where: whereUnique,
    });

    if (updated && updated.disposalCount <= 0) {
      await prisma.reportDisposalAggregation.delete({
        where: whereUnique,
      });
    }
  }
};

export const aggregateReportDisposal = async (reportId: string): Promise<void> => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      disposals: {
        include: { product: true }
      }
    }
  });

  if (!report) {
    throw new Error('Report not found');
  }

  // Group disposals by hour bucket AND product type
  const hourlyGroups = new Map<string, { disposal: Decimal; count: number }>();

  for (const reportDisposal of report.disposals) {
    // Skip disposals without product type
    if (!reportDisposal.product.type) continue;

    const hourBucket = startOfHour(reportDisposal.createdAt);
    const key = `${hourBucket.toISOString()}_${reportDisposal.product.type}`;

    const existing = hourlyGroups.get(key);
    if (existing) {
      existing.disposal = new Decimal(existing.disposal).add(reportDisposal.netDisposal);
      existing.count += 1;
    } else {
      hourlyGroups.set(key, {
        disposal: new Decimal(reportDisposal.netDisposal),
        count: 1
      });
    }
  }

  // Upsert each hour bucket + product type combination
  for (const [compositeKey, data] of hourlyGroups) {
    const [hourKey, productType] = compositeKey.split('_');
    const hourBucket = new Date(hourKey);

    await prisma.reportDisposalAggregation.upsert({
      where: {
        tenantId_hourBucket_productType: {
          tenantId: report.tenantId,
          hourBucket,
          productType: productType as ProductType
        }
      },
      update: {
        totalDisposal: { increment: data.disposal },
        disposalCount: { increment: data.count },
      },
      create: {
        tenantId: report.tenantId,
        hourBucket,
        productType: productType as ProductType,
        totalDisposal: data.disposal,
        disposalCount: data.count,
      },
    });
  }
};
