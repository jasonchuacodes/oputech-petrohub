'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { OputechPetrohubLogo } from '~/components/brand/oputech-petrohub-logo'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { PasswordInput } from '~/components/ui/password-input'
import { Spinner } from '~/components/ui/spinner'
import { useLoginMutation, useSessionQuery } from './auth.queries'
import { getUserLandingPath } from './auth-routing'
import { loginSchema, type LoginValues } from './login.schema'
import { SessionUnavailable } from './session-unavailable'

export function LoginPage() {
  const session = useSessionQuery()
  const login = useLoginMutation()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
    mode: 'onChange',
  })

  useEffect(() => {
    if (session.data) router.replace(getUserLandingPath(session.data))
  }, [router, session.data])

  if (session.isPending || session.data) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (session.isUnavailable) {
    return <SessionUnavailable retry={session.retry} />
  }

  const submit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: (nextSession) => router.replace(getUserLandingPath(nextSession)),
    })
  })

  return (
    <main className="flex min-h-dvh flex-col px-5 pt-5">
      <section className="flex flex-1 items-center justify-center py-8">
        <div className="shadow-card w-full max-w-md rounded-md bg-card p-5 sm:p-8">
          <header className="flex flex-col items-center gap-6 text-center">
            <h1 className="sr-only">Sign in to Oputech Petrohub</h1>
            <OputechPetrohubLogo className="h-auto w-full max-w-56" />
            <p className="text-base text-text-secondary">Sign in to manage today’s business.</p>
          </header>

          <form className="mt-7 flex flex-col gap-5" noValidate onSubmit={submit}>
            <div className="flex flex-col gap-3">
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
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
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
