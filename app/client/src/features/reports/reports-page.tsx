import { PageHeader } from '~/components/ui/page-header'
import { useActiveTenant } from '../layout/use-active-tenant'

export function ReportsPage() {
  const { tenant } = useActiveTenant()
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader title="Reports" description={`Generate and review ${tenant.name} shift reports.`} />
      <section className="rounded-md bg-card p-4 shadow-card">
        <h2 className="font-medium text-text-heading">Report generation</h2>
        <p className="mt-1 text-sm text-text-secondary">
          The transactional report workflow is the next implementation slice.
        </p>
      </section>
    </div>
  )
}
