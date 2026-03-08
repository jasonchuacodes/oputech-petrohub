import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';
import { ReportStatus } from '~/db/prisma';
import { ConflictError, ForbiddenError, NotFoundError } from '~/errors';

interface UpdateDisposalPayload {
  reportId: string;
  disposalId: string;
  afterReading: Decimal;
  userId: string;
}

const updateDisposal = async ({
  reportId,
  disposalId,
  afterReading,
  userId,
}: UpdateDisposalPayload) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.creatorId !== userId) {
    throw new ForbiddenError('Only the report creator can edit disposals');
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

  // TODO: lets add one more property here called 'calibrate:Number' this will signify calibration in Liters for a specific product.
  // calibrate value will be subtracted from the netDisposal amount. 
  // example: 
  // afterReading - 100

  /**
   * TODO: lets add one more property here called 'calibrate:Number' this will signify calibration in Liters for a specific product.
   * calibrate value will be subtracted from the netDisposal amount. 
   * example: 
   * afterReading:150
   * before reading:100
   * calibrate:10
   * 
   * netReading: 150-100 = 50 - 10 = 40
   * 
   */
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
