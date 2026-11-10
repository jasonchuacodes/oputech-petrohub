'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, ChevronLeft, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import type { AuthUser } from '../../auth/auth.types'
import { useSessionQuery } from '../../auth/auth.queries'
import { useUpdateMyProfileMutation } from '../account.queries'
import { profileFormSchema, type ProfileFormValues } from './profile-form.schema'

export function AccountSettingsPage() {
  const session = useSessionQuery()
  const user = session.data?.user

  if (!user) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  return <ProfileForm key={user.id} user={user} />
}

function ProfileForm({ user }: { user: AuthUser }) {
  const updateProfile = useUpdateMyProfileMutation()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
    },
    mode: 'onChange',
    resolver: zodResolver(profileFormSchema),
  })

  const submit = handleSubmit(async (values) => {
    try {
      const profile = await updateProfile.mutateAsync({
        firstName: values.firstName || null,
        lastName: values.lastName || null,
      })
      reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
      })
      toast.success('Profile updated successfully')
    } catch {
      setError('root', { message: 'Unable to update your profile. Please try again.' })
    }
  })

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-5 py-5 md:px-6 md:py-8">
      <header className="flex min-h-11 items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="-ml-2">
          <Link href="/me" aria-label="Back to Me">
            <ChevronLeft aria-hidden="true" className="size-6" />
          </Link>
        </Button>
        <h1 className="text-page-title font-semibold text-text-heading">Account</h1>
      </header>

      <form
        className="flex flex-col gap-6"
        noValidate
        onSubmit={submit}
      >
        <section className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
          <div>
            <h2 className="text-xl font-semibold text-text-heading">Account information</h2>
            <p className="mt-1 text-base text-text-secondary">Update your profile information.</p>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <NameField
                id="profile-first-name"
                label="First name"
                autoComplete="given-name"
                error={errors.firstName?.message}
                disabled={updateProfile.isPending}
                registration={register('firstName')}
              />
              <NameField
                id="profile-last-name"
                label="Last name"
                autoComplete="family-name"
                error={errors.lastName?.message}
                disabled={updateProfile.isPending}
                registration={register('lastName')}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="profile-username" className="font-medium text-text-heading">
                Username
              </label>
              <div className="relative">
                <AtSign
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-text-secondary"
                />
                <Input
                  id="profile-username"
                  className="h-14 cursor-default rounded-md pl-12 text-base wide:h-14 wide:text-base"
                  value={user.username}
                  readOnly
                  aria-describedby="profile-username-description"
                />
              </div>
              <p id="profile-username-description" className="text-sm text-text-secondary">
                Your administrator controls this login username.
              </p>
            </div>
          </div>

          {errors.root?.message && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {errors.root.message}
            </p>
          )}
        </section>

        <footer className="flex gap-3">
          <Button asChild variant="outline" size="lg" className="flex-1 text-base">
            <Link href="/me">Cancel</Link>
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-1 text-base"
            disabled={!isDirty || !isValid || updateProfile.isPending}
          >
            {updateProfile.isPending && <Spinner className="size-4" />}
            {updateProfile.isPending ? 'Saving…' : 'Save changes'}
          </Button>
        </footer>
      </form>
    </div>
  )
}

function NameField({
  id,
  label,
  autoComplete,
  error,
  disabled,
  registration,
}: {
  id: string
  label: string
  autoComplete: string
  error?: string
  disabled: boolean
  registration: UseFormRegisterReturn
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <label htmlFor={id} className="font-medium text-text-heading">
        {label}
      </label>
      <div className="relative">
        <UserRound
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-text-secondary"
        />
        <Input
          id={id}
          autoComplete={autoComplete}
          className="h-14 rounded-md pl-12 text-base wide:h-14 wide:text-base"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...registration}
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
