import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';
import { ReportStatus } from '~/db/prisma';
import { ConflictError, NotFoundError } from '~/errors';

import { recalculateReportTotals } from '../utils/totals-calculator';

interface CreateExpensePayload {
  reportId: string;
  description: string;
  amount: Decimal;
}

const createExpense = async ({
  reportId,
  description,
  amount,
}: CreateExpensePayload) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const expense = await prisma.reportExpense.create({
    data: {
      reportId,
      description,
      amount,
    },
  });

  await recalculateReportTotals(reportId);

  return expense;
};

const deleteExpense = async (expenseId: string, reportId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const expense = await prisma.reportExpense.findUnique({
    where: { id: expenseId },
  });

  if (!expense) {
    throw new NotFoundError('Expense not found');
  }

  if (expense.reportId !== reportId) {
    throw new ConflictError('Expense does not belong to this report');
  }

  await prisma.reportExpense.delete({
    where: { id: expenseId },
  });

  await recalculateReportTotals(reportId);
};

export { createExpense, deleteExpense };
