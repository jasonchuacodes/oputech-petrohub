'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AtSign, ChevronLeft, KeyRound, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { useDisclosure } from '~/hooks/useDisclosure'
import type { AuthUser } from '../../auth/auth.types'
import { useChangePasswordMutation, useSessionQuery } from '../../auth/auth.queries'
import { AuthApiError } from '../../auth/auth.api'
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '../../auth/change-password.schema'
import { useUpdateMyProfileMutation } from '../account.queries'
import { profileFormSchema, type ProfileFormValues } from './profile-form.schema'

type AccountTab = 'information' | 'security'

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
    <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-5 py-5 md:px-6 md:py-8">
      <header className="flex min-h-11 items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="-ml-2">
          <Link href="/me" aria-label="Back to Me">
            <ChevronLeft aria-hidden="true" className="size-6" />
          </Link>
        </Button>
        <h1 className="text-page-title font-semibold text-text-heading">Account Settings</h1>
      </header>

      <AccountTabs activeTab={activeTab} onSelect={setActiveTab} />

      <div
        id="account-information-panel"
        role="tabpanel"
        aria-labelledby="account-tab"
        hidden={activeTab !== 'information'}
      >
        <ProfileForm key={user.id} user={user} />
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

function AccountTabs({
  activeTab,
  onSelect,
}: {
  activeTab: AccountTab
  onSelect: (tab: AccountTab) => void
}) {
  const informationTab = useRef<HTMLButtonElement>(null)
  const securityTab = useRef<HTMLButtonElement>(null)
  const tabs = [
    {
      id: 'account-tab',
      panelId: 'account-information-panel',
      label: 'Account',
      value: 'information' as const,
      ref: informationTab,
    },
    {
      id: 'security-tab',
      panelId: 'security-panel',
      label: 'Security',
      value: 'security' as const,
      ref: securityTab,
    },
  ]

  const selectAndFocus = (tab: AccountTab) => {
    onSelect(tab)
    const target = tab === 'information' ? informationTab : securityTab
    target.current?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Account settings"
      className="flex rounded-md bg-muted p-1"
    >
      {tabs.map((tab) => {
        const selected = activeTab === tab.value
        return (
          <button
            key={tab.value}
            ref={tab.ref}
            id={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={tab.panelId}
            tabIndex={selected ? 0 : -1}
            className={`flex h-12 flex-1 items-center justify-center rounded-sm px-3 text-base font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 ${
              selected
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-heading'
            }`}
            onClick={() => onSelect(tab.value)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
              event.preventDefault()
              selectAndFocus(tab.value === 'information' ? 'security' : 'information')
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
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
    <form className="flex flex-col gap-6" noValidate onSubmit={submit}>
      <section className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-6">
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
  )
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
        <Input
          id={id}
          type="password"
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
