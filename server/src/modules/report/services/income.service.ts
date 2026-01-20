import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';
import { ReportStatus } from '~/db/prisma';
import { ConflictError, NotFoundError } from '~/errors';

interface CreateIncomePayload {
  reportId: string;
  description: string;
  amount: Decimal;
}

const createIncome = async ({
  reportId,
  description,
  amount,
}: CreateIncomePayload) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const income = await prisma.reportIncome.create({
    data: {
      reportId,
      description,
      amount,
    },
  });

  return income;
};

const deleteIncome = async (incomeId: string, reportId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const income = await prisma.reportIncome.findUnique({
    where: { id: incomeId },
  });

  if (!income) {
    throw new NotFoundError('Income not found');
  }

  if (income.reportId !== reportId) {
    throw new ConflictError('Income does not belong to this report');
  }

  await prisma.reportIncome.delete({
    where: { id: incomeId },
  });
};

export { createIncome, deleteIncome };
