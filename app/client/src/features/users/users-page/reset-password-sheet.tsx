import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, X } from 'lucide-react'
import { useCallback, useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import { useResetUserPasswordMutation, type UserSummary } from '../users.queries'
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from './user-form.schema'

type ResetPasswordSheetProps = {
  open: boolean
  tenantId: string
  user: UserSummary
  onClose: () => void
}

export function ResetPasswordSheet({
  open,
  tenantId,
  user,
  onClose,
}: ResetPasswordSheetProps) {
  const passwordReset = useResetUserPasswordMutation()
  const titleId = useId()
  const descriptionId = useId()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onChange',
    resolver: zodResolver(resetPasswordFormSchema),
  })

  const close = useCallback(() => {
    if (passwordReset.isPending) return
    reset()
    onClose()
  }, [onClose, passwordReset.isPending, reset])

  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [close, open])

  const submit = handleSubmit(async ({ newPassword }) => {
    try {
      await passwordReset.mutateAsync({
        tenantId,
        input: { userId: user.id, newPassword },
      })
      reset()
      onClose()
      toast.success('Password updated successfully')
    } catch {
      setError('root', { message: 'Unable to update the password. Please try again.' })
    }
  })

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center wide:items-center wide:p-6">
      <button
        type="button"
        aria-label="Close password reset"
        tabIndex={-1}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        disabled={passwordReset.isPending}
        onClick={close}
      />
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-sheet bg-card shadow-2xl wide:max-w-xl wide:rounded-lg"
        noValidate
        onSubmit={submit}
      >
        <div
          aria-hidden="true"
          className="mx-auto mt-3 h-1.5 w-14 shrink-0 rounded-full bg-foreground/35 wide:hidden"
        />
        <header className="relative flex shrink-0 flex-col gap-1 p-5 pr-16">
          <h2 id={titleId} className="text-lg font-semibold text-text-heading">
            Reset Password
          </h2>
          <p id={descriptionId} className="text-sm text-text-secondary">
            Set a new password for {user.fullName}.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close password reset"
            className="absolute right-3 top-4 text-text-secondary"
            disabled={passwordReset.isPending}
            onClick={close}
          >
            <X aria-hidden="true" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <div className="mb-5 flex gap-3 rounded-md border border-border bg-surface-subtle p-4">
            <KeyRound aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-text-secondary" />
            <p className="text-sm text-text-secondary">
              The user will be signed out on all devices and can sign in with this new password.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <PasswordField
              id={`reset-password-${user.id}`}
              label="New password"
              autoFocus
              autoComplete="new-password"
              error={errors.newPassword?.message}
              disabled={passwordReset.isPending}
              {...register('newPassword')}
            />
            <PasswordField
              id={`confirm-reset-password-${user.id}`}
              label="Confirm new password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              disabled={passwordReset.isPending}
              {...register('confirmPassword')}
            />
            {errors.root?.message && (
              <p role="alert" className="text-sm text-destructive">
                {errors.root.message}
              </p>
            )}
          </div>
        </div>

        <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={passwordReset.isPending}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!isValid || passwordReset.isPending}
          >
            {passwordReset.isPending && <Spinner className="size-4" />}
            {passwordReset.isPending ? 'Updating…' : 'Update password'}
          </Button>
        </footer>
      </form>
    </div>,
    document.body,
  )
}

function PasswordField({
  id,
  label,
  error,
  ...props
}: React.ComponentProps<'input'> & { id: string; label: string; error?: string }) {
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        type="password"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
