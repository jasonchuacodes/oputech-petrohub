interface ShiftSchedule {
  shiftStart: Date;
  shiftEnd: Date;
}

interface SessionBoundaries {
  checkIn: Date;
  checkOut: Date;
}

interface ShiftCalculationResult {
  sessionHours: number;
  hoursCap: number;
}

/**
 * Extract UTC hours/minutes from shift DateTime
 */
const extractShiftTime = (shiftDateTime: Date): { hour: number; minute: number } => {
  return {
    hour: shiftDateTime.getUTCHours(),
    minute: shiftDateTime.getUTCMinutes(),
  };
};

/**
 * Apply shift time (hour/minute) to a target date, preserving the date portion
 */
const applyShiftTimeToDate = (
  targetDate: Date,
  shiftTime: { hour: number; minute: number },
): Date => {
  const result = new Date(targetDate);
  result.setUTCHours(shiftTime.hour, shiftTime.minute, 0, 0);
  return result;
};

/**
 * Calculate session hours with shift boundary enforcement
 * Returns 0 if effective check-out ≤ effective check-in
 */
export const calculateShiftBasedHours = (
  shiftSchedule: ShiftSchedule,
  boundaries: SessionBoundaries,
): ShiftCalculationResult => {
  const shiftStartTime = extractShiftTime(shiftSchedule.shiftStart);
  const shiftEndTime = extractShiftTime(shiftSchedule.shiftEnd);

  // Apply shift times to actual check-in/out dates
  const shiftStartToday = applyShiftTimeToDate(boundaries.checkIn, shiftStartTime);
  const shiftEndToday = applyShiftTimeToDate(boundaries.checkOut, shiftEndTime);

  // Enforce shift boundaries (can't log hours outside shift window)
  const effectiveCheckIn = new Date(
    Math.max(boundaries.checkIn.getTime(), shiftStartToday.getTime()),
  );
  const effectiveCheckOut = new Date(
    Math.min(boundaries.checkOut.getTime(), shiftEndToday.getTime()),
  );

  // Calculate session hours
  let sessionHours = 0;
  if (effectiveCheckOut.getTime() > effectiveCheckIn.getTime()) {
    const ms = effectiveCheckOut.getTime() - effectiveCheckIn.getTime();
    sessionHours = Number((ms / (1000 * 60 * 60)).toFixed(2));
  }

  // Calculate shift duration cap
  const shiftDurationMs = shiftSchedule.shiftEnd.getTime() - shiftSchedule.shiftStart.getTime();
  const hoursCap = Number((shiftDurationMs / (1000 * 60 * 60)).toFixed(2));

  return { sessionHours, hoursCap };
};

/**
 * Calculate hours between two timestamps
 */
export const calculateHoursBetween = (start: Date, end: Date): number => {
  const ms = end.getTime() - start.getTime();
  return Number((ms / (1000 * 60 * 60)).toFixed(2));
};
