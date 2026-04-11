import { prisma } from '~/db';
import { TimesheetEntryAction } from '~/db/prisma';
import { getEndOfDay, getStartOfDay } from '~/utils';
import { checkOut } from '~/modules/timesheet/services/timesheet.service';

export const runAutoCheckout = async () => {
  console.log('[autocheckout] Running auto-checkout job...');

  const startOfDay = getStartOfDay();
  const endOfDay = getEndOfDay();

  const todayTimesheets = await prisma.timesheet.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      entries: {
        orderBy: { timestamp: 'asc' },
      },
      user: {
        select: {
          tenants: {
            select: {
              shift: {
                select: {
                  shiftStart: true,
                  shiftEnd: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const openTimesheets = todayTimesheets.filter((ts) => {
    const lastEntry = ts.entries[ts.entries.length - 1];
    if (!lastEntry || lastEntry.action !== TimesheetEntryAction.CHECK_IN) return false;

    // TODO (night shift): when night shift is implemented, skip users whose
    // shift crosses midnight (shiftEnd < shiftStart) so they are handled by
    // a separate night-shift checkout job instead.

    return true;
  });

  if (openTimesheets.length === 0) {
    console.log('[autocheckout] No open check-ins found.');
    return;
  }

  console.log(`[autocheckout] Found ${openTimesheets.length} open check-in(s). Processing...`);

  for (const ts of openTimesheets) {
    try {
      await checkOut(ts.userId);
      console.log(`[autocheckout] Checked out userId: ${ts.userId}`);
    } catch (error) {
      console.error(`[autocheckout] Failed to check out userId: ${ts.userId}`, error);
    }
  }

  console.log('[autocheckout] Auto-checkout job complete.');
};
