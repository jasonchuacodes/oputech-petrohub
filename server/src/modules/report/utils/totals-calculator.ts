import { Decimal } from '@prisma/client/runtime/library';

import { prisma } from '~/db';

export const recalculateReportTotals = async (reportId: string): Promise<void> => {
  const entriesTotal = await prisma.reportEntry.aggregate({
    where: { reportId },
    _sum: { totalPrice: true },
  });

  const expensesTotal = await prisma.reportExpense.aggregate({
    where: { reportId },
    _sum: { amount: true },
  });

  const totalIncome = entriesTotal._sum.totalPrice || new Decimal(0);
  const totalExpenses = expensesTotal._sum.amount || new Decimal(0);
  const netTotal = totalIncome.sub(totalExpenses);

  await prisma.report.update({
    where: { id: reportId },
    data: { totalIncome, totalExpenses, netTotal },
  });
};
