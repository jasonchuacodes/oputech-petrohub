import { Decimal } from '@prisma/client/runtime/library';

interface ReportWithTotals {
  totalIncome: number;
  totalExpenses: number;
  netTotal: number;
}

export const computeReportTotals = (report: {
  income?: { amount: Decimal }[];
  expenses?: { amount: Decimal }[];
}): ReportWithTotals => {
  const totalIncome = report.income?.reduce((sum, income) => sum + Number(income.amount), 0) ?? 0;

  const totalExpenses =
    report.expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) ?? 0;

  const netTotal = totalIncome - totalExpenses;

  return { totalIncome, totalExpenses, netTotal };
};
