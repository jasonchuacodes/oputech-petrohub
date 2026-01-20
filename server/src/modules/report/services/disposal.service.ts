import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';
import { ReportStatus } from '~/db/prisma';
import { ConflictError, NotFoundError } from '~/errors';

interface UpdateDisposalPayload {
  reportId: string;
  disposalId: string;
  afterReading: Decimal;
}

const updateDisposal = async ({
  reportId,
  disposalId,
  afterReading,
}: UpdateDisposalPayload) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const disposal = await prisma.reportDisposal.findUnique({
    where: { id: disposalId },
  });

  if (!disposal) {
    throw new NotFoundError('Disposal not found');
  }

  if (disposal.reportId !== reportId) {
    throw new ConflictError('Disposal does not belong to this report');
  }

  // Calculate netDisposal and totalSales using Decimal methods
  const netDisposal = afterReading.sub(disposal.beforeReading);
  const totalSales = netDisposal.mul(disposal.priceSnapshot);

  const updatedDisposal = await prisma.reportDisposal.update({
    where: { id: disposalId },
    data: {
      afterReading,
      netDisposal,
      totalSales,
    },
  });

  return updatedDisposal;
};

export { updateDisposal };
