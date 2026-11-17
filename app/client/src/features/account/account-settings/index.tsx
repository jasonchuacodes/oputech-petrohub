'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { ContentSection } from '~/components/ui/content-section'
import { Input } from '~/components/ui/input'
import { PasswordInput } from '~/components/ui/password-input'
import { PageHeader } from '~/components/ui/page-header'
import { SectionTabs, type SectionTabOption } from '~/components/ui/section-tabs'
import { Spinner } from '~/components/ui/spinner'
import { Textarea } from '~/components/ui/textarea'
import { useDisclosure } from '~/hooks/useDisclosure'
import { useChangePasswordMutation, useSessionQuery } from '../../auth/auth.queries'
import { AuthApiError } from '../../auth/auth.api'
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '../../auth/change-password.schema'
import {
  useMyProfileQuery,
  useUpdateMyProfileMutation,
  type MyProfile,
} from '../account.queries'
import {
  profileFormSchema,
  type ProfileFormInput,
  type ProfileFormValues,
} from './profile-form.schema'

type AccountTab = 'information' | 'security'

const accountTabs = [
  {
    id: 'account-information-tab',
    panelId: 'account-information-panel',
    label: 'Account',
    value: 'information',
  },
  {
    id: 'security-tab',
    panelId: 'security-panel',
    label: 'Security',
    value: 'security',
  },
] as const satisfies readonly SectionTabOption<AccountTab>[]

export function AccountSettingsPage() {
  const session = useSessionQuery()
  const user = session.data?.user
  const [activeTab, setActiveTab] = useState<AccountTab>('information')

  if (!user) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-8 px-5 py-5 md:max-w-4xl md:px-6 md:py-8 wide:max-w-7xl">
      <PageHeader
        title="Account settings"
        description="Manage your account information and security settings."
        backHref="/me"
        backLabel="Back to Me"
      />

      <SectionTabs
        ariaLabel="Account settings"
        tabs={accountTabs}
        value={activeTab}
        onValueChange={setActiveTab}
        touchSize="large"
      />

      <div
        id="account-information-panel"
        role="tabpanel"
        aria-labelledby="account-information-tab"
        hidden={activeTab !== 'information'}
      >
        <ProfilePanel />
      </div>
      <div
        id="security-panel"
        role="tabpanel"
        aria-labelledby="security-tab"
        hidden={activeTab !== 'security'}
      >
        <PasswordForm />
      </div>
    </div>
  )
}

function ProfilePanel() {
  const profile = useMyProfileQuery()

  if (profile.isPending) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (profile.isError) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-text-secondary">Unable to load your account details.</p>
        <Button type="button" variant="outline" size="sm" onClick={() => void profile.refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  return <ProfileForm key={profile.data.id} profile={profile.data} />
}

function ProfileForm({ profile }: { profile: MyProfile }) {
  const updateProfile = useUpdateMyProfileMutation()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    defaultValues: toProfileFormValues(profile),
    mode: 'onChange',
    resolver: zodResolver(profileFormSchema),
  })

  const submit = handleSubmit(async (values) => {
    try {
      const profile = await updateProfile.mutateAsync({
        firstName: values.firstName || null,
        lastName: values.lastName || null,
        birthday: values.birthday || null,
        address: values.address || null,
        sss: values.sss || null,
        pagibig: values.pagibig || null,
        philhealth: values.philhealth || null,
        tin: values.tin || null,
      })
      reset({ ...values, firstName: profile.firstName ?? '', lastName: profile.lastName ?? '' })
      toast.success('Profile updated successfully')
    } catch {
      setError('root', { message: 'Unable to update your profile. Please try again.' })
    }
  })

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={submit}>
      <ContentSection label="Account">
        <div className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-username" className="font-medium text-text-heading">
                Username
              </label>
              <div className="relative">
                <AtSign
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-text-tertiary"
                />
                <Input
                  id="profile-username"
                  autoCapitalize="none"
                  className="h-14 cursor-default rounded-md bg-muted pl-12 text-base text-text-secondary disabled:cursor-default disabled:opacity-100 wide:h-14 wide:text-base"
                  value={profile.username}
                  disabled
                  readOnly
                  aria-disabled="true"
                  aria-readonly="true"
                />
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection label="Personal information">
        <div className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <ProfileTextField
                id="profile-first-name"
                label="First name"
                autoComplete="given-name"
                error={errors.firstName?.message}
                disabled={updateProfile.isPending}
                registration={register('firstName')}
              />
              <ProfileTextField
                id="profile-last-name"
                label="Last name"
                autoComplete="family-name"
                error={errors.lastName?.message}
                disabled={updateProfile.isPending}
                registration={register('lastName')}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-birthday" className="font-medium text-text-heading">
                Birthday
              </label>
              <Input
                id="profile-birthday"
                type="date"
                className="h-14 rounded-md text-base wide:h-14 wide:text-base"
                disabled={updateProfile.isPending}
                aria-invalid={Boolean(errors.birthday)}
                aria-describedby={errors.birthday ? 'profile-birthday-error' : undefined}
                {...register('birthday')}
              />
              {errors.birthday?.message && (
                <p id="profile-birthday-error" role="alert" className="text-sm text-destructive">
                  {errors.birthday.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-address" className="font-medium text-text-heading">
                Address
              </label>
              <Textarea
                id="profile-address"
                maxLength={500}
                disabled={updateProfile.isPending}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? 'profile-address-error' : undefined}
                {...register('address')}
              />
              {errors.address?.message && (
                <p id="profile-address-error" role="alert" className="text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection label="Government IDs">
        <div className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <ProfileTextField
                id="profile-sss"
                label="SSS"
                error={errors.sss?.message}
                disabled={updateProfile.isPending}
                registration={register('sss')}
              />
              <ProfileTextField
                id="profile-pagibig"
                label="Pag-IBIG"
                error={errors.pagibig?.message}
                disabled={updateProfile.isPending}
                registration={register('pagibig')}
              />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <ProfileTextField
                id="profile-philhealth"
                label="PhilHealth"
                error={errors.philhealth?.message}
                disabled={updateProfile.isPending}
                registration={register('philhealth')}
              />
              <ProfileTextField
                id="profile-tin"
                label="TIN"
                error={errors.tin?.message}
                disabled={updateProfile.isPending}
                registration={register('tin')}
              />
            </div>
          </div>
          {errors.root?.message && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {errors.root.message}
            </p>
          )}
        </div>
      </ContentSection>

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
  )
}

function toProfileFormValues(profile: MyProfile): ProfileFormValues {
  return {
    firstName: profile.firstName ?? '',
    lastName: profile.lastName ?? '',
    birthday: profile.birthday ?? '',
    address: profile.address ?? '',
    sss: profile.sss ?? '',
    pagibig: profile.pagibig ?? '',
    philhealth: profile.philhealth ?? '',
    tin: profile.tin ?? '',
  }
}

function PasswordForm() {
  const changePassword = useChangePasswordMutation()
  const confirmation = useDisclosure()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isValid },
  } = useForm<ChangePasswordValues>({
    defaultValues: { currentPassword: '', newPassword: '' },
    mode: 'onChange',
    resolver: zodResolver(changePasswordSchema),
  })

  const submit = handleSubmit(() => confirmation.onOpen())

  const confirmUpdate = async () => {
    const { currentPassword, newPassword } = getValues()
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword })
      confirmation.onClose()
      toast.success('Password updated. Sign in with your new password.')
      router.replace('/login')
    } catch (error) {
      confirmation.onClose()
      if (error instanceof AuthApiError && error.code === 'INVALID_CREDENTIALS') {
        setError(
          'currentPassword',
          { message: 'The current password is incorrect.' },
          { shouldFocus: true },
        )
        return
      }
      setError('root', { message: 'Unable to update your password. Please try again.' })
    }
  }

  return (
    <>
      <form className="flex flex-col gap-6" noValidate onSubmit={submit}>
        <section className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
          <div>
            <h2 className="text-xl font-semibold text-text-heading">Password</h2>
            <p className="mt-1 text-base text-text-secondary">
              Change your password to keep your account secure.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <PasswordField
              id="account-current-password"
              label="Current password"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              disabled={changePassword.isPending}
              registration={register('currentPassword')}
            />
            <PasswordField
              id="account-new-password"
              label="New password"
              autoComplete="new-password"
              error={errors.newPassword?.message}
              disabled={changePassword.isPending}
              registration={register('newPassword')}
            />

            {errors.root?.message && (
              <p role="alert" className="text-sm text-destructive">
                {errors.root.message}
              </p>
            )}
          </div>
        </section>

        <footer className="flex gap-3">
          <Button asChild variant="outline" size="lg" className="flex-1 text-base">
            <Link href="/me">Cancel</Link>
          </Button>
          <Button
            type="submit"
            size="lg"
            className="flex-1 text-base"
            disabled={!isValid || changePassword.isPending}
          >
            Update password
          </Button>
        </footer>
      </form>

      <ConfirmationDialog
        open={confirmation.open}
        title="Update password?"
        description="You will be signed out on all devices and must sign in with your new password."
        icon={KeyRound}
        confirmText="Update password"
        loading={changePassword.isPending}
        onClose={confirmation.onClose}
        onConfirm={() => void confirmUpdate()}
      />
    </>
  )
}

function ProfileTextField({
  id,
  label,
  autoComplete,
  error,
  disabled,
  registration,
}: {
  id: string
  label: string
  autoComplete?: string
  error?: string
  disabled: boolean
  registration: UseFormRegisterReturn
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <label htmlFor={id} className="font-medium text-text-heading">
        {label}
      </label>
      <Input
        id={id}
        maxLength={80}
        autoComplete={autoComplete}
        className="h-14 rounded-md text-base wide:h-14 wide:text-base"
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...registration}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function PasswordField({
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
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium text-text-heading">
        {label}
      </label>
      <div className="relative">
        <KeyRound
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-text-secondary"
        />
        <PasswordInput
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
