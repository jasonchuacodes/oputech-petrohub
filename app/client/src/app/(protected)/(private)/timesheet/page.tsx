import type { Metadata } from 'next'
import { AttendancePage } from '~/features/attendance/attendance-page'
import { parseTimesheetDateRange } from '~/features/attendance/attendance-route'

export const metadata: Metadata = { title: 'Timesheet' }

export default async function TimesheetRoute({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const initialRange = parseTimesheetDateRange(await searchParams)
  return <AttendancePage initialRange={initialRange} />
}
