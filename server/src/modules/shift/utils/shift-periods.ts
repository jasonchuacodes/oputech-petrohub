import { prisma } from '~/db';
import { ProductCategory } from '~/db/prisma';
import { applyTimeToDate, formatTime } from '~/utils/date';

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
    const shiftStart = applyTimeToDate(shift.shiftStart, shiftDate);
    const shiftEnd = applyTimeToDate(shift.shiftEnd, shiftDate);

    if (shiftEnd <= shiftStart) {
      shiftEnd.setDate(shiftEnd.getDate() + 1);
    }

    const priceChanges = await prisma.productPrice.findMany({
      where: {
        product: { tenantId, category: ProductCategory.FUEL },
        effectiveFrom: {
          gt: shiftStart,
          lt: shiftEnd,
        },
      },
      select: { effectiveFrom: true },
      orderBy: { effectiveFrom: 'asc' },
      distinct: ['effectiveFrom'],
    });

    const uniqueChangeTimes = [
      ...new Map(
        priceChanges.map((pc) => {
          const t = new Date(pc.effectiveFrom);
          t.setSeconds(0, 0);
          return [t.getTime(), t];
        }),
      ).values(),
    ];

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
        if (changeTime <= currentStart) continue;
        shiftPeriods.push({
          shiftId: shift.id,
          shiftName: shift.name,
          periodStart: currentStart.toISOString(),
          periodEnd: changeTime.toISOString(),
          label: `${shift.name} (${formatTime(currentStart)} - ${formatTime(changeTime)})`,
        });
        currentStart = changeTime;
      }

      if (currentStart < shiftEnd) {
        shiftPeriods.push({
          shiftId: shift.id,
          shiftName: shift.name,
          periodStart: currentStart.toISOString(),
          periodEnd: shiftEnd.toISOString(),
          label: `${shift.name} (${formatTime(currentStart)} - ${formatTime(shiftEnd)})`,
        });
      }
    }
  }

  return shiftPeriods;
};
