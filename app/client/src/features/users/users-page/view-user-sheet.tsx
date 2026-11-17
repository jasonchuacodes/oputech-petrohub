import { Eye } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '~/components/ui/button'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import { useUserDetailsQuery, type UserSummary } from '../users.queries'

type ViewUserSheetProps = {
  tenantId: string
  user: UserSummary
  onClose: () => void
}

export function ViewUserSheet({ tenantId, user, onClose }: ViewUserSheetProps) {
  const details = useUserDetailsQuery(tenantId, user.id)

  return (
    <Sheet
      open
      title="User details"
      description={user.fullName}
      icon={Eye}
      manageFocus
      onClose={onClose}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        {details.isPending ? (
          <div className="flex min-h-48 items-center justify-center">
            <Spinner className="size-5" />
          </div>
        ) : details.isError ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-text-secondary">Unable to load user details.</p>
            <Button type="button" variant="outline" size="sm" onClick={() => void details.refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <DetailsSection title="Account">
              <Detail label="Name" value={details.data.fullName} />
              <Detail label="Username" value={details.data.username} />
              <Detail label="Role" value={roleLabel(details.data.role)} />
              <Detail
                label="Tenant access"
                value={
                  details.data.tenantMembership?.availability === 'inactive' ? 'Inactive' : 'Active'
                }
              />
            </DetailsSection>

            <DetailsSection title="Personal information">
              <Detail
                label="Birthday"
                value={details.data.birthday ? formatBirthday(details.data.birthday) : null}
              />
              <Detail label="Address" value={details.data.address} multiline />
            </DetailsSection>

            <DetailsSection title="Government IDs">
              <Detail label="SSS" value={details.data.sss} />
              <Detail label="Pag-IBIG" value={details.data.pagibig} />
              <Detail label="PhilHealth" value={details.data.philhealth} />
              <Detail label="TIN" value={details.data.tin} />
            </DetailsSection>
          </div>
        )}
      </div>

      <footer className="flex shrink-0 justify-end border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button type="button" variant="outline" className="w-full wide:w-auto" onClick={onClose}>
          Close
        </Button>
      </footer>
    </Sheet>
  )
}

function DetailsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-text-heading">
        {title}
      </h3>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 rounded-md border border-border/70 bg-surface-subtle p-4 md:grid-cols-2">
        {children}
      </dl>
    </section>
  )
}

function Detail({
  label,
  value,
  multiline = false,
}: {
  label: string
  value?: string | null
  multiline?: boolean
}) {
  return (
    <div className={multiline ? 'md:col-span-2' : undefined}>
      <dt className="text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</dt>
      <dd
        className={`mt-1 break-words text-sm text-text-heading${
          multiline ? ' whitespace-pre-wrap' : ''
        }`}
      >
        {value || <span className="text-text-tertiary">Not provided</span>}
      </dd>
    </div>
  )
}

function roleLabel(role: string): string {
  if (role === 'admin') return 'Administrator'
  if (role === 'superadmin') return 'Super administrator'
  return 'Member'
}

function formatBirthday(value: string): string {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1)),
  )
}
