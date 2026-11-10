import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { OputechPetrohubLogo } from '~/components/brand/oputech-petrohub-logo'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { useLoginMutation, useSessionQuery } from './auth.queries'
import { loginSchema, type LoginValues } from './login.schema'

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const session = useSessionQuery()
  const login = useLoginMutation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onChange',
  })

  if (session.data) {
    return (
      <Navigate
        to={session.data.user.currentTenantId ? '/reports' : '/onboarding'}
        replace
      />
    )
  }

  const submit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: ({ user }) =>
        navigate(
          user.shouldChangePassword
            ? '/change-password'
            : user.currentTenantId
              ? '/reports'
              : '/onboarding',
          { replace: true },
        ),
    })
  })

  return (
    <main className="flex min-h-dvh flex-col px-5 pt-5">
      <section className="flex flex-1 items-center justify-center py-8">
        <div className="shadow-card w-full max-w-[36.25rem] rounded-md bg-card p-5 sm:p-8">
          <header className="flex flex-col items-center gap-6 text-center">
            <h1 className="sr-only">Sign in to Oputech Petrohub</h1>
            <OputechPetrohubLogo className="h-auto w-full max-w-56" />
            <p className="text-base text-text-secondary">Sign in to manage today’s business.</p>
          </header>

          <form className="mt-7 flex flex-col gap-5" noValidate onSubmit={submit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                autoComplete="username"
                autoCapitalize="none"
                placeholder="Enter your username"
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="pr-12"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-sm border-l border-input text-text-tertiary outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/40"
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </button>
              </div>
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

            <Button
              type="submit"
              size="lg"
              disabled={!isValid || login.isPending}
              className="w-full text-base"
            >
              {login.isPending && <Spinner className="size-4" />}
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </section>

      <footer className="shrink-0 pb-[max(2rem,env(safe-area-inset-bottom))] text-center text-sm leading-6 text-text-secondary">
        <p>Oputech Petrohub</p>
        <p>© {new Date().getFullYear()} Oputech. All rights reserved.</p>
      </footer>
    </main>
  )
}
