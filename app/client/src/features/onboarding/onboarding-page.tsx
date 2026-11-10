import { zodResolver } from '@hookform/resolvers/zod'
import { ClientError } from 'graphql-request'
import { Check, LogOut, Plus, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { OputechPetrohubLogo } from '~/components/brand/oputech-petrohub-logo'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { useAuth } from '../auth/auth-context'
import { useLogoutMutation } from '../auth/auth.queries'
import { setActiveTenant } from '../tenants/active-tenant'
import { useCreateTenantMutation } from '../tenants/tenants.queries'
import { onboardingSchema, type OnboardingValues } from './onboarding.schema'

export function OnboardingPage() {
  const auth = useAuth()
  const createTenant = useCreateTenantMutation()
  const logout = useLogoutMutation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: '' },
    mode: 'onChange',
  })

  const user = auth.session?.user
  if (!user) return <Navigate to="/login" replace />
  if (user.currentTenantId) return <Navigate to="/reports" replace />

  const submit = handleSubmit(async ({ name }) => {
    try {
      const tenant = await createTenant.mutateAsync(name)
      setActiveTenant(tenant.id)
      auth.activateTenant(tenant.id)
      navigate('/reports', { replace: true })
    } catch (error) {
      setError('root', { message: getCreateTenantErrorMessage(error) })
    }
  })

  const busy = isSubmitting || createTenant.isPending || logout.isPending

  return (
    <div className="min-h-dvh px-5 py-8 sm:px-6">
      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col justify-center">
        <div className="mb-6 text-center">
          <OputechPetrohubLogo variant="mark" className="mx-auto mb-4 h-auto w-16" />
          <h1 className="text-page-title font-semibold">Set up your workspace</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Create the tenant where you&apos;ll manage reports and station operations.
          </p>
        </div>

        <div className="shadow-card rounded-md bg-card p-4 sm:p-5">
          {user.role === 'superadmin' ? (
            <section aria-labelledby="create-tenant-heading">
              <div className="mb-4 flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Plus className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="create-tenant-heading" className="font-medium text-text-heading">
                    Create your first tenant
                  </h2>
                  <p className="mt-0.5 text-sm text-text-secondary">
                    Use your business or station name.
                  </p>
                </div>
              </div>

              <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tenant-name" className="text-sm font-medium">
                    Tenant name
                  </label>
                  <Input
                    id="tenant-name"
                    autoFocus
                    maxLength={80}
                    placeholder="e.g. Main Station"
                    disabled={busy}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'tenant-name-error' : undefined}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p id="tenant-name-error" role="alert" className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={!isValid || busy}>
                  {isSubmitting || createTenant.isPending ? (
                    <>
                      <Spinner className="size-4" />
                      Creating tenant…
                    </>
                  ) : (
                    <>
                      <Check aria-hidden="true" />
                      Create and continue
                    </>
                  )}
                </Button>
              </form>
            </section>
          ) : (
            <section className="text-center" aria-labelledby="tenant-access-heading">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="size-6" aria-hidden="true" />
              </span>
              <h2 id="tenant-access-heading" className="mt-4 font-medium">
                Tenant access required
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                Ask a super administrator to assign a tenant to your account.
              </p>
            </section>
          )}

          {errors.root && (
            <p role="alert" className="mt-4 rounded-sm bg-destructive/5 p-3 text-sm text-destructive">
              {errors.root.message}
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          className="mx-auto mt-4 text-text-secondary"
          disabled={busy}
          onClick={() => logout.mutate()}
        >
          {logout.isPending ? <Spinner className="size-4" /> : <LogOut aria-hidden="true" />}
          Sign out
        </Button>
      </main>
    </div>
  )
}

function getCreateTenantErrorMessage(error: unknown): string {
  const fallback = 'Unable to create the tenant. Please try again.'
  if (!(error instanceof ClientError)) {
    return error instanceof Error && error.message ? error.message : fallback
  }

  const graphqlError = error.response.errors?.[0]
  const originalError = graphqlError?.extensions?.originalError
  if (typeof originalError === 'object' && originalError !== null && 'message' in originalError) {
    const message = originalError.message
    if (typeof message === 'string' && message) return message
  }

  return graphqlError?.message || fallback
}
