import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Eye, EyeOff, X } from 'lucide-react'
import { useCallback, useEffect, useId, useState, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import type { UserRole } from '~/generated/graphql'
import { useDisclosure } from '~/hooks/useDisclosure'
import { isUsernameConflict } from '../user-errors'
import { useCreateUserMutation } from '../users.queries'
import {
  addUserFormSchema,
  type AddUserFormInput,
  type AddUserFormValues,
} from './user-form.schema'
import { getRoleLabel, RoleSelectSheet, type ManageableUserRole } from './role-select-sheet'

type AddUserSheetProps = {
  open: boolean
  tenantId: string
  actorRole: UserRole
  onClose: () => void
}

const defaultValues: AddUserFormValues = {
  username: '',
  password: '',
  role: 'member',
}

const assignableRoles = ['member', 'admin'] as const satisfies readonly ManageableUserRole[]

export function AddUserSheet({ open, tenantId, actorRole, onClose }: AddUserSheetProps) {
  const createUser = useCreateUserMutation()
  const roleOptions = useDisclosure()
  const [showPassword, setShowPassword] = useState(false)
  const titleId = useId()
  const descriptionId = useId()
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddUserFormInput, unknown, AddUserFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(addUserFormSchema),
  })
  const selectedRole = useWatch({ control, name: 'role' }) ?? 'member'

  const resetForm = useCallback(() => {
    reset(defaultValues)
    setShowPassword(false)
  }, [reset])

  const close = useCallback(() => {
    if (createUser.isPending) return
    resetForm()
    onClose()
  }, [createUser.isPending, onClose, resetForm])

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

  if (!open) return null

  const submit = handleSubmit(async (values) => {
    try {
      await createUser.mutateAsync({
        tenantId,
        input: {
          username: values.username.trim().toLowerCase(),
          password: values.password,
          role: actorRole === 'admin' ? 'member' : values.role,
        },
      })
      resetForm()
      onClose()
      toast.success('User created successfully')
    } catch (error) {
      if (isUsernameConflict(error)) {
        setError('username', { message: 'This username is already in use.' }, { shouldFocus: true })
        return
      }
      setError('root', { message: 'Unable to create the user. Please try again.' })
    }
  })

  return createPortal(
    <div
      aria-hidden={roleOptions.open || undefined}
      className={`fixed inset-0 z-50 flex items-end justify-center wide:items-center wide:p-6${
        roleOptions.open ? ' invisible pointer-events-none' : ''
      }`}
    >
      <button
        type="button"
        aria-label="Close Add User sheet"
        tabIndex={-1}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        disabled={createUser.isPending}
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

        <header className="flex shrink-0 items-start gap-3 p-5 pb-4">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-xl font-semibold text-text-heading">
              Add User
            </h2>
            <p id={descriptionId} className="mt-0.5 text-sm text-text-secondary">
              Create a user for the current tenant.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close Add User"
            className="-mr-2 -mt-1 text-text-secondary"
            disabled={createUser.isPending}
            onClick={close}
          >
            <X aria-hidden="true" />
          </Button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <div className="flex flex-col gap-4">
            <FormField
              id="new-user-username"
              label="Username *"
              error={errors.username?.message}
            >
              <Input
                id="new-user-username"
                autoFocus
                autoComplete="off"
                placeholder="e.g. johndoe"
                disabled={createUser.isPending}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? 'new-user-username-error' : undefined}
                {...register('username')}
              />
            </FormField>

            <FormField
              id="new-user-password"
              label="Password *"
              error={errors.password?.message}
            >
              <div className="relative">
                <Input
                  id="new-user-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="pr-12"
                  placeholder="Enter a password"
                  disabled={createUser.isPending}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'new-user-password-error' : undefined}
                  {...register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 text-text-tertiary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={createUser.isPending}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                </Button>
              </div>
            </FormField>

            <FormField id="new-user-role" label="Role" error={errors.role?.message}>
              <input type="hidden" {...register('role')} />
              {actorRole === 'superadmin' ? (
                <Button
                  id="new-user-role"
                  type="button"
                  variant="outline"
                  className="w-full justify-between px-3 font-normal"
                  disabled={createUser.isPending}
                  aria-haspopup="dialog"
                  aria-expanded={roleOptions.open}
                  onClick={roleOptions.onOpen}
                >
                  {getRoleLabel(selectedRole)}
                  <ChevronDown aria-hidden="true" className="text-text-tertiary" />
                </Button>
              ) : (
                <Button
                  id="new-user-role"
                  type="button"
                  variant="outline"
                  className="w-full justify-start px-3 font-normal"
                  disabled
                >
                  Member
                </Button>
              )}
            </FormField>

            <RoleSelectSheet
              open={roleOptions.open}
              value={selectedRole}
              roles={assignableRoles}
              onSelect={(role) =>
                setValue('role', role, { shouldDirty: true, shouldValidate: true })
              }
              onClose={roleOptions.onClose}
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
            disabled={createUser.isPending}
            onClick={close}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={!isValid || createUser.isPending}>
            {createUser.isPending && <Spinner className="size-4" />}
            {createUser.isPending ? 'Creating…' : 'Create User'}
          </Button>
        </footer>
      </form>
    </div>,
    document.body,
  )
}

function FormField({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-1.5${className ? ` ${className}` : ''}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
