/**
 * One-time script: rebuilds all report aggregations from scratch.
 *
 * Usage (prod):
 *   DATABASE_URL=<neon-prod-url> npx ts-node -r tsconfig-paths/register src/scripts/rebuild-aggregations.ts
 *
 * What it does (inside a single transaction):
 *   1. Clears all 4 aggregation tables for the target tenant(s)
 *   2. Re-aggregates from every SUBMITTED report
 *
 * Safe to re-run — idempotent because step 1 always starts from a clean slate.
 */

import { prisma } from '~/db';
import { aggregateReportIncome } from '~/modules/analytics/services/income-aggregation.service';
import { aggregateReportExpense } from '~/modules/analytics/services/expense-aggregation.service';
import { aggregateReportDisposal } from '~/modules/analytics/services/disposal-aggregation.service';
import { aggregateReportInventorySales } from '~/modules/analytics/services/inventory-sales-aggregation.service';
import { ReportStatus } from '~/db/prisma';

const main = async () => {
  // Fetch all tenants that have at least one SUBMITTED report
  const tenants = await prisma.tenant.findMany({
    where: { reports: { some: { status: ReportStatus.SUBMITTED } } },
    select: { id: true, name: true },
  });

  if (tenants.length === 0) {
    console.log('No tenants with SUBMITTED reports found. Nothing to do.');
    return;
  }

  console.log(`Found ${tenants.length} tenant(s) to rebuild:\n`);
  for (const t of tenants) {
    console.log(`  - ${t.name} (${t.id})`);
  }
  console.log();

  for (const tenant of tenants) {
    console.log(`\n=== Rebuilding: ${tenant.name} ===`);

    const submittedReports = await prisma.report.findMany({
      where: { tenantId: tenant.id, status: ReportStatus.SUBMITTED },
      select: { id: true },
    });

    console.log(`  SUBMITTED reports: ${submittedReports.length}`);

    // Print current aggregation counts before clearing
    const [incBefore, expBefore, disBefore, invBefore] = await Promise.all([
      prisma.reportIncomeAggregation.count({ where: { tenantId: tenant.id } }),
      prisma.reportExpenseAggregation.count({ where: { tenantId: tenant.id } }),
      prisma.reportDisposalAggregation.count({ where: { tenantId: tenant.id } }),
      prisma.reportInventorySalesAggregation.count({ where: { tenantId: tenant.id } }),
    ]);

    console.log(`  Before — income:${incBefore} expense:${expBefore} disposal:${disBefore} invSales:${invBefore}`);

    await prisma.$transaction(
      async (tx) => {
        // Step 1: clear all aggregations for this tenant
        await tx.reportIncomeAggregation.deleteMany({ where: { tenantId: tenant.id } });
        await tx.reportExpenseAggregation.deleteMany({ where: { tenantId: tenant.id } });
        await tx.reportDisposalAggregation.deleteMany({ where: { tenantId: tenant.id } });
        await tx.reportInventorySalesAggregation.deleteMany({ where: { tenantId: tenant.id } });

        // Step 2: re-aggregate from every SUBMITTED report
        for (const { id: reportId } of submittedReports) {
          await aggregateReportIncome(reportId, tx);
          await aggregateReportExpense(reportId, tx);
          await aggregateReportDisposal(reportId, tx);
          await aggregateReportInventorySales(reportId, tx);
        }
      },
      { timeout: 60000 }
    );

    // Print counts after rebuild
    const [incAfter, expAfter, disAfter, invAfter] = await Promise.all([
      prisma.reportIncomeAggregation.count({ where: { tenantId: tenant.id } }),
      prisma.reportExpenseAggregation.count({ where: { tenantId: tenant.id } }),
      prisma.reportDisposalAggregation.count({ where: { tenantId: tenant.id } }),
      prisma.reportInventorySalesAggregation.count({ where: { tenantId: tenant.id } }),
    ]);

    console.log(`  After  — income:${incAfter} expense:${expAfter} disposal:${disAfter} invSales:${invAfter}`);
    console.log(`  Done.`);
  }

  console.log('\nRebuild complete.');
};

main()
  .catch((e) => {
    console.error('Script failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
