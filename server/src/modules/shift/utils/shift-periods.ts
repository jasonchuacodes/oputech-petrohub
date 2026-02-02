import { prisma } from '~/db';
import { ProductCategory } from '~/db/prisma';
import { formatTime } from '~/utils/date';

export interface ShiftPeriod {
  shiftId: string;
  shiftName: string;
  periodStart: string;
  periodEnd: string;
  label: string;
}

export const getShiftPeriodsWithPriceChanges = async (
  tenantId: string,
  shiftDate: Date,
): Promise<ShiftPeriod[]> => {
  const shifts = await prisma.shift.findMany({
    where: { tenantId },
    orderBy: { shiftStart: 'asc' },
  });

  const shiftPeriods: ShiftPeriod[] = [];

  for (const shift of shifts) {
    const shiftStart = new Date(
      shiftDate.getFullYear(),
      shiftDate.getMonth(),
      shiftDate.getDate(),
      shift.shiftStart.getHours(),
      shift.shiftStart.getMinutes(),
      0,
    );

    const shiftEnd = new Date(
      shiftDate.getFullYear(),
      shiftDate.getMonth(),
      shiftDate.getDate(),
      shift.shiftEnd.getHours(),
      shift.shiftEnd.getMinutes(),
      0,
    );

    if (shiftEnd <= shiftStart) {
      shiftEnd.setDate(shiftEnd.getDate() + 1);
    }

    const priceChanges = await prisma.productPrice.findMany({
      where: {
        product: { tenantId, category: ProductCategory.FUEL },
        effectiveFrom: {
          gt: new Date(),
          lte: shiftEnd,
        },
      },
      select: { effectiveFrom: true },
      orderBy: { effectiveFrom: 'asc' },
      distinct: ['effectiveFrom'],
    });

    const uniqueChangeTimes = priceChanges.map((pc) => pc.effectiveFrom);

    if (uniqueChangeTimes.length === 0) {
      shiftPeriods.push({
        shiftId: shift.id,
        shiftName: shift.name,
        periodStart: shiftStart.toISOString(),
        periodEnd: shiftEnd.toISOString(),
        label: `${shift.name} (${formatTime(shiftStart)} - ${formatTime(shiftEnd)})`,
      });
    } else {
      let currentStart = shiftStart;

      for (const changeTime of uniqueChangeTimes) {
        shiftPeriods.push({
          shiftId: shift.id,
          shiftName: shift.name,
          periodStart: currentStart.toISOString(),
          periodEnd: changeTime.toISOString(),
          label: `${shift.name} (${formatTime(currentStart)} - ${formatTime(changeTime)})`,
        });
        currentStart = changeTime;
      }

      shiftPeriods.push({
        shiftId: shift.id,
        shiftName: shift.name,
        periodStart: currentStart.toISOString(),
        periodEnd: shiftEnd.toISOString(),
        label: `${shift.name} (${formatTime(currentStart)} - ${formatTime(shiftEnd)})`,
      });
    }
  }

  return shiftPeriods;
};
