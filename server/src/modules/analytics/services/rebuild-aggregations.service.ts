import { Decimal } from '@prisma/client/runtime/library';
import { startOfHour } from 'date-fns';
import { prisma } from '~/db';
import { aggregateReportIncome } from './income-aggregation.service';
import { aggregateReportExpense } from './expense-aggregation.service';
import { aggregateReportDisposal } from './disposal-aggregation.service';
import { aggregateReportInventorySales } from './inventory-sales-aggregation.service';
import { ReportStatus } from '~/db/prisma';

export type RebuildResult = {
  status: 'skipped' | 'rebuilt';
  tenantId: string;
  submittedReports: number;
  before: { income: number; expense: number; disposal: number; inventorySales: number };
  after: { income: number; expense: number; disposal: number; inventorySales: number };
};

const checkIncomeInSync = async (tenantId: string): Promise<boolean> => {
  const items = await prisma.reportIncome.findMany({
    where: { report: { tenantId, status: ReportStatus.SUBMITTED } },
    select: { amount: true, createdAt: true },
  });

  const expected = new Map<string, { total: Decimal; count: number }>();
  for (const item of items) {
    const key = startOfHour(item.createdAt).toISOString();
    const ex = expected.get(key);
    if (ex) {
      ex.total = ex.total.add(item.amount);
      ex.count++;
    } else {
      expected.set(key, { total: new Decimal(item.amount), count: 1 });
    }
  }

  const current = await prisma.reportIncomeAggregation.findMany({ where: { tenantId } });

  if (current.length !== expected.size) return false;

  for (const row of current) {
    const key = row.hourBucket.toISOString();
    const ex = expected.get(key);
    if (!ex) return false;
    if (!new Decimal(row.totalAmount).equals(ex.total)) return false;
    if (row.incomeCount !== ex.count) return false;
  }

  return true;
};

const checkExpenseInSync = async (tenantId: string): Promise<boolean> => {
  const items = await prisma.reportExpense.findMany({
    where: { report: { tenantId, status: ReportStatus.SUBMITTED } },
    select: { amount: true, createdAt: true },
  });

  const expected = new Map<string, { total: Decimal; count: number }>();
  for (const item of items) {
    const key = startOfHour(item.createdAt).toISOString();
    const ex = expected.get(key);
    if (ex) {
      ex.total = ex.total.add(item.amount);
      ex.count++;
    } else {
      expected.set(key, { total: new Decimal(item.amount), count: 1 });
    }
  }

  const current = await prisma.reportExpenseAggregation.findMany({ where: { tenantId } });

  if (current.length !== expected.size) return false;

  for (const row of current) {
    const key = row.hourBucket.toISOString();
    const ex = expected.get(key);
    if (!ex) return false;
    if (!new Decimal(row.totalAmount).equals(ex.total)) return false;
    if (row.expenseCount !== ex.count) return false;
  }

  return true;
};

const checkDisposalInSync = async (tenantId: string): Promise<boolean> => {
  const items = await prisma.reportDisposal.findMany({
    where: { report: { tenantId, status: ReportStatus.SUBMITTED }, product: { type: { not: null } } },
    include: { product: true },
  });

  const expected = new Map<string, { total: Decimal; count: number }>();
  for (const item of items) {
    if (!item.product.type) continue;
    const key = `${startOfHour(item.createdAt).toISOString()}_${item.product.type}`;
    const ex = expected.get(key);
    if (ex) {
      ex.total = ex.total.add(item.netDisposal);
      ex.count++;
    } else {
      expected.set(key, { total: new Decimal(item.netDisposal), count: 1 });
    }
  }

  const current = await prisma.reportDisposalAggregation.findMany({ where: { tenantId } });

  if (current.length !== expected.size) return false;

  for (const row of current) {
    const key = `${row.hourBucket.toISOString()}_${row.productType}`;
    const ex = expected.get(key);
    if (!ex) return false;
    if (!new Decimal(row.totalDisposal).equals(ex.total)) return false;
    if (row.disposalCount !== ex.count) return false;
  }

  return true;
};

const checkInventorySalesInSync = async (tenantId: string): Promise<boolean> => {
  const items = await prisma.reportInventory.findMany({
    where: { report: { tenantId, status: ReportStatus.SUBMITTED } },
    select: { amount: true, createdAt: true },
  });

  const expected = new Map<string, { total: Decimal; count: number }>();
  for (const item of items) {
    const key = startOfHour(item.createdAt).toISOString();
    const ex = expected.get(key);
    if (ex) {
      ex.total = ex.total.add(item.amount);
      ex.count++;
    } else {
      expected.set(key, { total: new Decimal(item.amount), count: 1 });
    }
  }

  const current = await prisma.reportInventorySalesAggregation.findMany({ where: { tenantId } });

  if (current.length !== expected.size) return false;

  for (const row of current) {
    const key = row.hourBucket.toISOString();
    const ex = expected.get(key);
    if (!ex) return false;
    if (!new Decimal(row.totalAmount).equals(ex.total)) return false;
    if (row.inventorySalesCount !== ex.count) return false;
  }

  return true;
};

const checkAggregationsInSync = async (tenantId: string): Promise<boolean> => {
  const [incomeOk, expenseOk, disposalOk, inventorySalesOk] = await Promise.all([
    checkIncomeInSync(tenantId),
    checkExpenseInSync(tenantId),
    checkDisposalInSync(tenantId),
    checkInventorySalesInSync(tenantId),
  ]);

  return incomeOk && expenseOk && disposalOk && inventorySalesOk;
};

export const rebuildAggregationsForTenant = async (tenantId: string): Promise<RebuildResult> => {
  const inSync = await checkAggregationsInSync(tenantId);

  const submittedReports = await prisma.report.findMany({
    where: { tenantId, status: ReportStatus.SUBMITTED },
    select: { id: true },
  });

  const [incBefore, expBefore, disBefore, invBefore] = await Promise.all([
    prisma.reportIncomeAggregation.count({ where: { tenantId } }),
    prisma.reportExpenseAggregation.count({ where: { tenantId } }),
    prisma.reportDisposalAggregation.count({ where: { tenantId } }),
    prisma.reportInventorySalesAggregation.count({ where: { tenantId } }),
  ]);

  if (inSync) {
    return {
      status: 'skipped',
      tenantId,
      submittedReports: submittedReports.length,
      before: { income: incBefore, expense: expBefore, disposal: disBefore, inventorySales: invBefore },
      after: { income: incBefore, expense: expBefore, disposal: disBefore, inventorySales: invBefore },
    };
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.reportIncomeAggregation.deleteMany({ where: { tenantId } });
      await tx.reportExpenseAggregation.deleteMany({ where: { tenantId } });
      await tx.reportDisposalAggregation.deleteMany({ where: { tenantId } });
      await tx.reportInventorySalesAggregation.deleteMany({ where: { tenantId } });

      for (const { id: reportId } of submittedReports) {
        await aggregateReportIncome(reportId, tx);
        await aggregateReportExpense(reportId, tx);
        await aggregateReportDisposal(reportId, tx);
        await aggregateReportInventorySales(reportId, tx);
      }
    },
    { timeout: 60000 }
  );

  const [incAfter, expAfter, disAfter, invAfter] = await Promise.all([
    prisma.reportIncomeAggregation.count({ where: { tenantId } }),
    prisma.reportExpenseAggregation.count({ where: { tenantId } }),
    prisma.reportDisposalAggregation.count({ where: { tenantId } }),
    prisma.reportInventorySalesAggregation.count({ where: { tenantId } }),
  ]);

  return {
    status: 'rebuilt',
    tenantId,
    submittedReports: submittedReports.length,
    before: { income: incBefore, expense: expBefore, disposal: disBefore, inventorySales: invBefore },
    after: { income: incAfter, expense: expAfter, disposal: disAfter, inventorySales: invAfter },
  };
};
