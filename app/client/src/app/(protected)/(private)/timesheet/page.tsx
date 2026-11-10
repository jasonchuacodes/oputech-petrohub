import type { Metadata } from 'next'
import { AttendancePage } from '~/features/attendance/attendance-page'

export const metadata: Metadata = { title: 'Timesheet' }

export default function TimesheetRoute() {
  return <AttendancePage />
}
