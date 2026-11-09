import { PageHeader } from '~/components/ui/page-header'

export function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader title="Dashboard" description="Submitted report performance at a glance." />
    </div>
  )
}
