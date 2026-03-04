import { Decimal } from '@prisma/client/runtime/library';

import { PrismaClient, Shift, User, ReportStatus } from '../../src/db/prisma';

interface Shifts {
  morningShift: Shift;
  afternoonShift: Shift;
}

interface UsersByShift {
  morningShiftUsers: User[];
  afternoonShiftUsers: User[];
}

export class ReportSeeder {
  constructor(private prisma: PrismaClient) {}

  private getShiftDate(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private getAmount(baseAmount: number, variation: number): Decimal {
    const factor = 1 + variation / 100;
    return new Decimal((baseAmount * factor).toFixed(2));
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-CA');
  }

  private async getPriceSnapshot(productId: string, shiftDate: Date): Promise<Decimal> {
    const productPrice = await this.prisma.productPrice.findFirst({
      where: {
        productId,
        effectiveFrom: { lte: shiftDate },
      },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (!productPrice) {
      throw new Error(`No price found for product ${productId} at date ${shiftDate}`);
    }

    return new Decimal(productPrice.price);
  }

  async seed(tenantId: string, adminUserId: string, shifts: Shifts, usersByShift: UsersByShift) {
    console.log('Seeding reports...');

    const products = await this.prisma.product.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });

    const reportDates = [this.getShiftDate(2), this.getShiftDate(1), this.getShiftDate(0)];

    const incomeTemplates = [
      { description: 'Cash sales', baseAmount: 15000 },
      { description: 'Online payments', baseAmount: 8500 },
      { description: 'Gift card redemptions', baseAmount: 2300 },
    ];

    const expenseTemplates = [
      { description: 'Office supplies', baseAmount: 450 },
      { description: 'Utilities', baseAmount: 1200 },
      { description: 'Transportation', baseAmount: 800 },
    ];

    // Disposal templates (meter start readings)
    const disposalStartingReadings = [1230904, 890450, 1050230, 670200];

    // Track current readings across shifts
    let currentReadings = [...disposalStartingReadings];

    // Disposal amounts (L) per shift
    const morningDisposalAmounts = [1200, 950, 1500, 800];
    const afternoonDisposalAmounts = [1350, 1100, 1650, 900];

    const variations = [
      [-5, -3, 2],
      [3, -2, 5],
      [-2, 4, -1],
      [4, -1, 3],
      [-3, 2, 4],
      [2, -4, 1],
    ];

    let reportIndex = 0;

    for (const shiftDate of reportDates) {
      const morningDisposalsData = await Promise.all(
        products.map(async (product, idx) => {
          const priceSnapshot = await this.getPriceSnapshot(product.id, shiftDate);
          const beforeReading = new Decimal(currentReadings[idx]);
          const netDisposal = new Decimal(morningDisposalAmounts[idx]);
          const afterReading = beforeReading.add(netDisposal);
          const totalSales = netDisposal.mul(priceSnapshot);

          // Update current readings for next shift
          currentReadings[idx] = afterReading.toNumber();

          return {
            productId: product.id,
            beforeReading,
            afterReading,
            netDisposal,
            priceSnapshot,
            totalSales,
          };
        }),
      );

      const morningTotalDisposalSales = morningDisposalsData.reduce(
        (sum, d) => sum.add(d.totalSales),
        new Decimal(0),
      );

      // Generate income based on disposal sales ±10
      const morningVariation = Math.random() * 20 - 10;
      const morningTargetIncome = morningTotalDisposalSales.toNumber() + morningVariation;

      // Distribute target income across categories using ratios
      const incomeRatios = [0.58, 0.33, 0.09]; // 58% cash, 33% online, 9% gift cards
      const morningIncomeData = incomeTemplates.map((template, idx) => ({
        description: template.description,
        amount: new Decimal((morningTargetIncome * incomeRatios[idx]).toFixed(2)),
      }));

      /**
       * MORNING SHIFT REPORT
       */
      const morningReport = await this.prisma.report.upsert({
        where: {
          tenantId_shiftDate_shiftId_periodStart: {
            tenantId,
            shiftDate,
            shiftId: shifts.morningShift.id,
            // TODO: add period start for unique
            periodStart: '',
          },
        },
        update: {},
        create: {
          tenantId,
          creatorId: adminUserId,
          shiftId: shifts.morningShift.id,
          shiftDate,
          status: ReportStatus.SUBMITTED,
          submittedAt: new Date(
            shiftDate.getTime() +
              shifts.morningShift.shiftEnd.getUTCHours() * 3600000 +
              1 * 3600000,
          ),
          income: {
            create: morningIncomeData,
          },
          expenses: {
            create: expenseTemplates.map((template, idx) => ({
              description: template.description,
              amount: this.getAmount(template.baseAmount, variations[reportIndex][idx]),
            })),
          },
          disposals: {
            create: morningDisposalsData,
          },
          periodEnd: '',
          periodStart: '',
        },
      });

      // Assign employees to morning report
      for (const user of usersByShift.morningShiftUsers) {
        await this.prisma.employeesOnReports.upsert({
          where: {
            userId_reportId: {
              userId: user.id,
              reportId: morningReport.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            reportId: morningReport.id,
          },
        });
      }

      // Calculate totals for logging
      const morningIncome = morningIncomeData.reduce(
        (sum, income) => sum.add(income.amount),
        new Decimal(0),
      );

      const morningExpenses = expenseTemplates.reduce(
        (sum, template, idx) =>
          sum.add(this.getAmount(template.baseAmount, variations[reportIndex][idx])),
        new Decimal(0),
      );

      const morningDisposalTotal = morningDisposalAmounts.reduce(
        (sum, amount) => sum.add(new Decimal(amount)),
        new Decimal(0),
      );

      console.log(
        `Report: ${this.formatDate(shiftDate)} - ${shifts.morningShift.name} (${
          ReportStatus.SUBMITTED
        })`,
      );
      console.log(`  Income: ₱${morningIncome.toFixed(2)}`);
      console.log(`  Expenses: ₱${morningExpenses.toFixed(2)}`);
      console.log(`  Disposals: ${morningDisposalTotal.toFixed(3)}L`);
      console.log(`  Employees: ${usersByShift.morningShiftUsers.length}`);

      reportIndex++;

      // Calculate disposal sales first for afternoon shift
      const afternoonDisposalsData = await Promise.all(
        products.map(async (product, idx) => {
          const priceSnapshot = await this.getPriceSnapshot(product.id, shiftDate);
          const beforeReading = new Decimal(currentReadings[idx]);
          const netDisposal = new Decimal(afternoonDisposalAmounts[idx]);
          const afterReading = beforeReading.add(netDisposal);
          const totalSales = netDisposal.mul(priceSnapshot);

          // Update current readings for next shift
          currentReadings[idx] = afterReading.toNumber();

          return {
            productId: product.id,
            beforeReading,
            afterReading,
            netDisposal,
            priceSnapshot,
            totalSales,
          };
        }),
      );

      // Calculate total disposal sales
      const afternoonTotalDisposalSales = afternoonDisposalsData.reduce(
        (sum, d) => sum.add(d.totalSales),
        new Decimal(0),
      );

      // Generate income based on disposal sales ±10
      const afternoonVariation = Math.random() * 20 - 10; // Random between -10 and +10
      const afternoonTargetIncome = afternoonTotalDisposalSales.toNumber() + afternoonVariation;

      // Distribute target income across categories using ratios
      const afternoonIncomeData = incomeTemplates.map((template, idx) => ({
        description: template.description,
        amount: new Decimal((afternoonTargetIncome * incomeRatios[idx]).toFixed(2)),
      }));

      /**
       * AFTERNOON SHIFT REPORT
       */
      const afternoonReport = await this.prisma.report.upsert({
        where: {
          tenantId_shiftDate_shiftId_periodStart: {
            tenantId,
            shiftDate,
            shiftId: shifts.afternoonShift.id,
            periodStart: '',
          },
        },
        update: {},
        create: {
          tenantId,
          creatorId: adminUserId,
          shiftId: shifts.afternoonShift.id,
          shiftDate,
          status: ReportStatus.SUBMITTED,
          submittedAt: new Date(
            shiftDate.getTime() +
              shifts.afternoonShift.shiftEnd.getUTCHours() * 3600000 +
              2 * 3600000,
          ),
          income: {
            create: afternoonIncomeData,
          },
          expenses: {
            create: expenseTemplates.map((template, idx) => ({
              description: template.description,
              amount: this.getAmount(template.baseAmount, variations[reportIndex][idx]),
            })),
          },
          disposals: {
            create: afternoonDisposalsData,
          },
          periodEnd: '',
          periodStart: '',
        },
      });

      // Assign employees to afternoon report
      for (const user of usersByShift.afternoonShiftUsers) {
        await this.prisma.employeesOnReports.upsert({
          where: {
            userId_reportId: {
              userId: user.id,
              reportId: afternoonReport.id,
            },
          },
          update: {},
          create: {
            userId: user.id,
            reportId: afternoonReport.id,
          },
        });
      }

      // Calculate totals for logging
      const afternoonIncome = afternoonIncomeData.reduce(
        (sum, income) => sum.add(income.amount),
        new Decimal(0),
      );
      const afternoonExpenses = expenseTemplates.reduce(
        (sum, template, idx) =>
          sum.add(this.getAmount(template.baseAmount, variations[reportIndex][idx])),
        new Decimal(0),
      );

      // Calculate disposal totals
      const afternoonDisposalTotal = afternoonDisposalAmounts.reduce(
        (sum, amount) => sum.add(new Decimal(amount)),
        new Decimal(0),
      );

      console.log(
        `Report: ${this.formatDate(shiftDate)} - ${shifts.afternoonShift.name} (${
          ReportStatus.SUBMITTED
        })`,
      );
      console.log(`  Income: ₱${afternoonIncome.toFixed(2)}`);
      console.log(`  Expenses: ₱${afternoonExpenses.toFixed(2)}`);
      console.log(`  Disposals: ${afternoonDisposalTotal.toFixed(3)}L`);
      console.log(`  Employees: ${usersByShift.afternoonShiftUsers.length}`);

      reportIndex++;
    }

    console.log('Reports seeded successfully\n');
  }
}
