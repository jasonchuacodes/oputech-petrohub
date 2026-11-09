import { useNavigate } from 'react-router-dom'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/ui/page-header'
import { useLogoutMutation, useSessionQuery } from '../auth/auth.queries'
import { clearActiveTenant } from '../tenants/active-tenant'

export function MorePage() {
  const session = useSessionQuery()
  const logout = useLogoutMutation()
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader title="More" description="Account and station management." />
      <section className="flex flex-col gap-4 rounded-md bg-card p-4 shadow-card">
        <div>
          <p className="font-medium text-text-heading">{session.data?.user.displayName}</p>
          <p className="text-sm text-text-tertiary">@{session.data?.user.username}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={logout.isPending}
          onClick={() =>
            logout.mutate(undefined, {
              onSuccess: () => {
                clearActiveTenant()
                navigate('/login', { replace: true })
              },
            })
          }
        >
          {logout.isPending ? 'Signing out…' : 'Sign out'}
        </Button>
      </section>
    </div>
  )
}
