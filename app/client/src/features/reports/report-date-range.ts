export type ReportDateRange = {
  startDate: string
  endDate: string
}

export function currentReportMonth(timezone: string, instant = new Date()): ReportDateRange {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(instant)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const year = Number(values.year)
  const month = Number(values.month)
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const prefix = `${values.year}-${values.month}`

  return {
    startDate: `${prefix}-01`,
    endDate: `${prefix}-${String(lastDay).padStart(2, '0')}`,
  }
}

export function previousReportBusinessDate(timezone: string, instant = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const date = new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)))
  date.setUTCDate(date.getUTCDate() - 1)
  return date.toISOString().slice(0, 10)
}
