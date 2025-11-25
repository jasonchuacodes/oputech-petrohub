/**
 * Get UTC start of day (00:00:00.000)
 */
export function getStartOfDayUTC(date: Date = new Date()): Date {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

/**
 * Get UTC end of day (23:59:59.999)
 */
export function getEndOfDayUTC(date: Date = new Date()): Date {
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return end;
}
