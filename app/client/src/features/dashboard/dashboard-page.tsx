import { PageHeader } from '~/components/ui/page-header'
import { setActiveTenant } from '../tenants/active-tenant'
import { useAppShellContext } from '../layout/use-active-tenant'

export function DashboardPage() {
  const { tenant: selected, tenants } = useAppShellContext()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader
        title="Home"
        description="Submitted report performance at a glance."
        action={
          <label className="block">
            <span className="sr-only">Station</span>
            <select
              value={selected.tenant.id}
              onChange={(event) => setActiveTenant(event.target.value)}
              className="h-11 w-36 max-w-[45vw] rounded-sm border border-input bg-card px-2 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/20 sm:w-52"
            >
              {tenants.map(({ tenant }) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </label>
        }
      />
    </div>
  )
}
