'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { PageHeader } from '~/components/ui/page-header'
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
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 py-5 md:p-6">
      <PageHeader
        title="Account Settings"
        description="Update the name shown on your account."
      />

      <form
        className="overflow-hidden rounded-md bg-card shadow-card"
        noValidate
        onSubmit={submit}
      >
        <div className="flex flex-col gap-4 p-5 wide:flex-row">
          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="profile-first-name" className="text-sm font-medium">
              First name
            </label>
            <Input
              id="profile-first-name"
              autoComplete="given-name"
              disabled={updateProfile.isPending}
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? 'profile-first-name-error' : undefined}
              {...register('firstName')}
            />
            {errors.firstName?.message && (
              <p id="profile-first-name-error" role="alert" className="text-sm text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            <label htmlFor="profile-last-name" className="text-sm font-medium">
              Last name
            </label>
            <Input
              id="profile-last-name"
              autoComplete="family-name"
              disabled={updateProfile.isPending}
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? 'profile-last-name-error' : undefined}
              {...register('lastName')}
            />
            {errors.lastName?.message && (
              <p id="profile-last-name-error" role="alert" className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {errors.root?.message && (
          <p role="alert" className="px-5 pb-4 text-sm text-destructive">
            {errors.root.message}
          </p>
        )}

        <footer className="flex justify-end gap-3 border-t border-border p-5">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || updateProfile.isPending}
            onClick={() =>
              reset({ firstName: user.firstName ?? '', lastName: user.lastName ?? '' })
            }
          >
            Reset
          </Button>
          <Button type="submit" disabled={!isDirty || !isValid || updateProfile.isPending}>
            {updateProfile.isPending && <Spinner className="size-4" />}
            {updateProfile.isPending ? 'Saving…' : 'Save Changes'}
          </Button>
        </footer>
      </form>
    </div>
  )
}
