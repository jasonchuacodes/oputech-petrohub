import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import {
  parseTimesheetDateRange,
  timesheetUserParamsSchema,
} from '~/features/attendance/attendance-route'
import { UserTimesheetPage } from '~/features/attendance/user-timesheet-page'

export const metadata: Metadata = { title: 'Member timesheet' }

export default async function UserTimesheetRoute({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const result = timesheetUserParamsSchema.safeParse(await params)
  if (!result.success) redirect('/timesheet')

  return (
    <UserTimesheetPage
      userId={result.data.userId}
      initialRange={parseTimesheetDateRange(await searchParams)}
    />
  )
}
