import { PageHeader } from '~/components/ui/page-header'

export function AttendancePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader title="Attendance" description="Review check-ins and timesheets." />
    </div>
  )
}
