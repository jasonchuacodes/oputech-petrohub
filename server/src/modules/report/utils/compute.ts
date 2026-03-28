import { Decimal } from '@prisma/client/runtime/library';

interface ReportWithTotals {
  totalIncome: number;
  totalExpenses: number;
  totalDisposalSales: number;
  totalInventorySales: number;
  totalSales: number;
  shortages: number;
  netTotal: number;
}

export const computeReportTotals = (report: {
  income?: { amount: Decimal }[];
  expenses?: { amount: Decimal }[];
  disposals?: { totalSales: Decimal }[];
  inventories?: { amount: Decimal }[];
}): ReportWithTotals => {
  const totalIncomeDecimal =
    report.income?.reduce((sum, income) => sum.add(income.amount), new Decimal(0)) ?? new Decimal(0);

  const totalExpensesDecimal =
    report.expenses?.reduce((sum, expense) => sum.add(expense.amount), new Decimal(0)) ?? new Decimal(0);

  const totalDisposalSalesDecimal =
    report.disposals?.reduce((sum, disposal) => sum.add(disposal.totalSales), new Decimal(0)) ??
    new Decimal(0);

  const totalInventorySalesDecimal =
    report.inventories?.reduce((sum, inventory) => sum.add(inventory.amount), new Decimal(0)) ??
    new Decimal(0);

  const totalSalesDecimal = totalIncomeDecimal.add(totalExpensesDecimal);

  const shortagesDecimal = totalDisposalSalesDecimal.sub(totalSalesDecimal);

  const netTotalDecimal = totalIncomeDecimal.add(totalInventorySalesDecimal);

  return {
    totalIncome: totalIncomeDecimal.toNumber(),
    totalExpenses: totalExpensesDecimal.toNumber(),
    totalDisposalSales: totalDisposalSalesDecimal.toNumber(),
    totalInventorySales: totalInventorySalesDecimal.toNumber(),
    totalSales: totalSalesDecimal.toNumber(),
    shortages: shortagesDecimal.toNumber(),
    netTotal: netTotalDecimal.toNumber(),
  };
};
