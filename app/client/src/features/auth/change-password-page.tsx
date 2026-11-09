import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { useChangePasswordMutation } from './auth.queries'
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from './change-password.schema'

export function ChangePasswordPage() {
  const changePassword = useChangePasswordMutation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const submit = handleSubmit(({ currentPassword, newPassword }) => {
    changePassword.mutate(
      { currentPassword, newPassword },
      { onSuccess: () => navigate('/login', { replace: true }) },
    )
  })

  return (
    <main className="flex min-h-dvh items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-primary">Petromate</p>
          <h1 className="text-page-title font-semibold">Set a new password</h1>
          <p className="text-sm text-text-secondary">
            Change the temporary password before continuing.
          </p>
        </header>

        <form className="flex flex-col gap-4" noValidate onSubmit={submit}>
          <PasswordField
            id="current-password"
            label="Current password"
            autoComplete="current-password"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <PasswordField
            id="new-password"
            label="New password"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          {changePassword.isError && (
            <p role="alert" className="text-sm text-destructive">
              The password could not be changed. Verify your current password and try again.
            </p>
          )}

          <Button type="submit" size="lg" disabled={changePassword.isPending}>
            {changePassword.isPending ? 'Changing password…' : 'Change password'}
          </Button>
        </form>
      </div>
    </main>
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
    <div className="flex flex-col gap-2">
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
