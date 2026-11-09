import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { useLoginMutation, useSessionQuery } from './auth.queries'
import { loginSchema, type LoginValues } from './login.schema'

export function LoginPage() {
  const session = useSessionQuery()
  const login = useLoginMutation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  if (session.isSuccess) return <Navigate to="/reports" replace />

  const submit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: ({ user }) =>
        navigate(user.shouldChangePassword ? '/change-password' : '/reports', { replace: true }),
    })
  })

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-primary">Petromate</p>
          <h1 className="text-page-title font-semibold">Sign in</h1>
          <p className="text-sm text-text-secondary">Access reports and station operations.</p>
        </header>

        <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              autoComplete="username"
              autoCapitalize="none"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? 'username-error' : undefined}
              {...register('username')}
            />
            {errors.username && (
              <p id="username-error" role="alert" className="text-sm text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              {...register('password')}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {login.isError && (
            <p role="alert" className="text-sm text-destructive">
              Sign in failed. Check your credentials and try again.
            </p>
          )}

          <Button type="submit" size="lg" disabled={login.isPending} className="w-full">
            {login.isPending && <Spinner className="size-4" />}
            {login.isPending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  )
}
