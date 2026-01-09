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
    return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  }

  async seed(tenantId: string, adminUserId: string, shifts: Shifts, usersByShift: UsersByShift) {
    console.log('Seeding reports...');

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

    // Variations for each report to add realism
    const variations = [
      [-5, -3, 2], // Report 1 variations for income items
      [3, -2, 5], // Report 2
      [-2, 4, -1], // Report 3
      [4, -1, 3], // Report 4
      [-3, 2, 4], // Report 5
      [2, -4, 1], // Report 6
    ];

    let reportIndex = 0;

    for (const shiftDate of reportDates) {
      // Create morning shift report
      const morningReport = await this.prisma.report.upsert({
        where: {
          tenantId_shiftDate_shiftId: {
            tenantId,
            shiftDate,
            shiftId: shifts.morningShift.id,
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
            shiftDate.getTime() + shifts.morningShift.shiftEnd.getUTCHours() * 3600000 + 2 * 3600000,
          ),
          income: {
            create: incomeTemplates.map((template, idx) => ({
              description: template.description,
              amount: this.getAmount(template.baseAmount, variations[reportIndex][idx]),
            })),
          },
          expenses: {
            create: expenseTemplates.map((template, idx) => ({
              description: template.description,
              amount: this.getAmount(template.baseAmount, variations[reportIndex][idx]),
            })),
          },
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
      const morningIncome = incomeTemplates.reduce(
        (sum, template, idx) =>
          sum.add(this.getAmount(template.baseAmount, variations[reportIndex][idx])),
        new Decimal(0),
      );
      const morningExpenses = expenseTemplates.reduce(
        (sum, template, idx) =>
          sum.add(this.getAmount(template.baseAmount, variations[reportIndex][idx])),
        new Decimal(0),
      );

      console.log(
        `Report: ${this.formatDate(shiftDate)} - ${shifts.morningShift.name} (${
          ReportStatus.SUBMITTED
        })`,
      );
      console.log(`  Income: ₱${morningIncome.toFixed(2)}`);
      console.log(`  Expenses: ₱${morningExpenses.toFixed(2)}`);
      console.log(`  Employees: ${usersByShift.morningShiftUsers.length}`);

      reportIndex++;

      // Create afternoon shift report
      const afternoonReport = await this.prisma.report.upsert({
        where: {
          tenantId_shiftDate_shiftId: {
            tenantId,
            shiftDate,
            shiftId: shifts.afternoonShift.id,
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
            shiftDate.getTime() + shifts.afternoonShift.shiftEnd.getUTCHours() * 3600000 + 2 * 3600000,
          ),
          income: {
            create: incomeTemplates.map((template, idx) => ({
              description: template.description,
              amount: this.getAmount(template.baseAmount, variations[reportIndex][idx]),
            })),
          },
          expenses: {
            create: expenseTemplates.map((template, idx) => ({
              description: template.description,
              amount: this.getAmount(template.baseAmount, variations[reportIndex][idx]),
            })),
          },
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
      const afternoonIncome = incomeTemplates.reduce(
        (sum, template, idx) =>
          sum.add(this.getAmount(template.baseAmount, variations[reportIndex][idx])),
        new Decimal(0),
      );
      const afternoonExpenses = expenseTemplates.reduce(
        (sum, template, idx) =>
          sum.add(this.getAmount(template.baseAmount, variations[reportIndex][idx])),
        new Decimal(0),
      );

      console.log(
        `Report: ${this.formatDate(shiftDate)} - ${shifts.afternoonShift.name} (${
          ReportStatus.SUBMITTED
        })`,
      );
      console.log(`  Income: ₱${afternoonIncome.toFixed(2)}`);
      console.log(`  Expenses: ₱${afternoonExpenses.toFixed(2)}`);
      console.log(`  Employees: ${usersByShift.afternoonShiftUsers.length}`);

      reportIndex++;
    }

    console.log('Reports seeded successfully\n');
  }
}
