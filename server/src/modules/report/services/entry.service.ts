import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '~/db';
import { ReportStatus } from '~/db/prisma';
import { ConflictError, NotFoundError } from '~/errors';

interface CreateReportEntryPayload {
  reportId: string;
  productId: string;
  quantity: Decimal;
}

const createOrUpdateEntry = async ({ reportId, productId, quantity }: CreateReportEntryPayload) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const latestPrice = await prisma.productPrice.findFirst({
    where: {
      productId,
      effectiveFrom: { lte: new Date() },
    },
    orderBy: { effectiveFrom: 'desc' },
  });

  if (!latestPrice) {
    throw new NotFoundError(`No price found for product`);
  }

  const unitPrice = latestPrice.price;
  const totalPrice = quantity.mul(unitPrice);

  const entry = await prisma.reportEntry.upsert({
    where: { reportId_productId: { reportId, productId } },
    create: {
      reportId,
      productId,
      quantity,
      unitPriceSnapshot: unitPrice,
      totalPrice,
    },
    update: {
      quantity,
      totalPrice: quantity.mul(unitPrice),
    },
    include: { product: true },
  });

  return entry;
};

const deleteEntry = async (entryId: string, reportId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const entry = await prisma.reportEntry.findUnique({
    where: { id: entryId },
  });

  if (!entry) {
    throw new NotFoundError('Entry not found');
  }

  if (entry.reportId !== reportId) {
    throw new ConflictError('Entry does not belong to this report');
  }

  await prisma.reportEntry.delete({
    where: { id: entryId },
  });
};

export { createOrUpdateEntry, deleteEntry };
