import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ChevronRight, Pencil, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useId, useState, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { createPortal } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { ConfirmationDialog } from '~/components/ui/confirmation-dialog'
import { Input } from '~/components/ui/input'
import { Spinner } from '~/components/ui/spinner'
import type { UserRole } from '~/generated/graphql'
import { useDisclosure } from '~/hooks/useDisclosure'
import { isUsernameConflict } from '../user-errors'
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
  type UserSummary,
} from '../users.queries'
import {
  editUserFormSchema,
  type EditUserFormInput,
  type EditUserFormValues,
} from './user-form.schema'
import { getRoleLabel, RoleSelectSheet, type ManageableUserRole } from './role-select-sheet'

const assignableRoles = ['member', 'admin'] as const satisfies readonly ManageableUserRole[]

type UserActionsProps = {
  tenantId: string
  user: UserSummary
  actorId: string
  actorRole: UserRole
  onDeleted: () => void
}

export function UserActions({
  tenantId,
  user,
  actorId,
  actorRole,
  onDeleted,
}: UserActionsProps) {
  const updateUser = useUpdateUserMutation()
  const deleteUser = useDeleteUserMutation()
  const actions = useDisclosure()
  const deleteConfirmation = useDisclosure()
  const roleOptions = useDisclosure()
  const [view, setView] = useState<'actions' | 'edit'>('actions')
  const [deleteError, setDeleteError] = useState<string>()
  const titleId = useId()
  const descriptionId = useId()
  const self = actorId === user.id
  const canManageRole =
    actorRole === 'superadmin' || (actorRole === 'admin' && user.role === 'member')
  const canManage = !self && canManageRole
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<EditUserFormInput, unknown, EditUserFormValues>({
    defaultValues: toFormValues(user),
    mode: 'onChange',
    resolver: zodResolver(editUserFormSchema),
  })
  const selectedRole = useWatch({ control, name: 'role' }) ?? 'member'

  const resetAndClose = useCallback(() => {
    actions.onClose()
    roleOptions.onClose()
    setView('actions')
    reset(toFormValues(user))
  }, [actions, reset, roleOptions, user])

  const close = useCallback(() => {
    if (!updateUser.isPending) resetAndClose()
  }, [resetAndClose, updateUser.isPending])

  useEffect(() => {
    if (!actions.open) return
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
  }, [actions.open, close])

  const openActions = () => {
    reset(toFormValues(user))
    setDeleteError(undefined)
    setView('actions')
    actions.onOpen()
  }

  const openEdit = () => {
    if (!canManage) return
    reset(toFormValues(user))
    setView('edit')
  }

  const submit = handleSubmit(async (values) => {
    if (!canManage) return
    try {
      await updateUser.mutateAsync({
        tenantId,
        input: {
          userId: user.id,
          username: values.username.trim().toLowerCase(),
          firstName: values.firstName.trim() || null,
          lastName: values.lastName.trim() || null,
          role: actorRole === 'admin' ? 'member' : values.role,
        },
      })
      resetAndClose()
      toast.success('User updated successfully')
    } catch (error) {
      if (isUsernameConflict(error)) {
        setError('username', { message: 'This username is already in use.' }, { shouldFocus: true })
        return
      }
      setError('root', { message: 'Unable to update the user. Please try again.' })
    }
  })

  const remove = async () => {
    if (!canManage || deleteUser.isPending) return
    setDeleteError(undefined)
    try {
      await deleteUser.mutateAsync({ tenantId, userId: user.id })
      deleteConfirmation.onClose()
      onDeleted()
      toast.success('User deleted successfully')
    } catch {
      setDeleteError('Unable to delete the user. Please try again.')
    }
  }

  const editing = view === 'edit'
  const disabledReason = self
    ? 'You cannot manage your own account here.'
    : 'Only super administrators can manage administrator accounts.'

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Actions for ${user.fullName}`}
        title="User actions"
        onClick={openActions}
      >
        <ChevronRight aria-hidden="true" className="size-5" />
      </Button>

      {actions.open &&
        createPortal(
          <div
            aria-hidden={roleOptions.open || undefined}
            className={`fixed inset-0 z-50 flex items-end justify-center wide:items-center wide:p-6${
              roleOptions.open ? ' invisible pointer-events-none' : ''
            }`}
          >
            <button
              type="button"
              aria-label={editing ? 'Close Edit User sheet' : 'Close user actions'}
              tabIndex={-1}
              className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
              disabled={updateUser.isPending}
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
                  {editing ? 'Edit User' : 'User Actions'}
                </h2>
                <p id={descriptionId} className="text-sm text-text-secondary">
                  {editing ? `Update ${user.fullName}'s account details.` : user.fullName}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={editing ? 'Close Edit User' : 'Close user actions'}
                  className="absolute right-3 top-4 text-text-secondary"
                  disabled={updateUser.isPending}
                  onClick={close}
                >
                  <X aria-hidden="true" />
                </Button>
              </header>

              {editing ? (
                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                  <div className="flex flex-col gap-4">
                    <FormField
                      id={`edit-user-username-${user.id}`}
                      label="Username *"
                      error={errors.username?.message}
                    >
                      <Input
                        id={`edit-user-username-${user.id}`}
                        autoFocus
                        autoComplete="off"
                        disabled={updateUser.isPending}
                        aria-invalid={Boolean(errors.username)}
                        aria-describedby={
                          errors.username ? `edit-user-username-${user.id}-error` : undefined
                        }
                        {...register('username')}
                      />
                    </FormField>

                    <div className="flex flex-col gap-4 wide:flex-row">
                      <FormField
                        id={`edit-user-first-name-${user.id}`}
                        label="First name"
                        error={errors.firstName?.message}
                        className="flex-1"
                      >
                        <Input
                          id={`edit-user-first-name-${user.id}`}
                          autoComplete="off"
                          disabled={updateUser.isPending}
                          aria-invalid={Boolean(errors.firstName)}
                          aria-describedby={
                            errors.firstName ? `edit-user-first-name-${user.id}-error` : undefined
                          }
                          {...register('firstName')}
                        />
                      </FormField>
                      <FormField
                        id={`edit-user-last-name-${user.id}`}
                        label="Last name"
                        error={errors.lastName?.message}
                        className="flex-1"
                      >
                        <Input
                          id={`edit-user-last-name-${user.id}`}
                          autoComplete="off"
                          disabled={updateUser.isPending}
                          aria-invalid={Boolean(errors.lastName)}
                          aria-describedby={
                            errors.lastName ? `edit-user-last-name-${user.id}-error` : undefined
                          }
                          {...register('lastName')}
                        />
                      </FormField>
                    </div>

                    <FormField
                      id={`edit-user-role-${user.id}`}
                      label="Role"
                      error={errors.role?.message}
                    >
                      <input type="hidden" {...register('role')} />
                      {actorRole === 'superadmin' ? (
                        <Button
                          id={`edit-user-role-${user.id}`}
                          type="button"
                          variant="outline"
                          className="w-full justify-between px-3 font-normal"
                          disabled={updateUser.isPending}
                          aria-haspopup="dialog"
                          aria-expanded={roleOptions.open}
                          onClick={roleOptions.onOpen}
                        >
                          {getRoleLabel(selectedRole)}
                          <ChevronDown aria-hidden="true" className="text-text-tertiary" />
                        </Button>
                      ) : (
                        <Button
                          id={`edit-user-role-${user.id}`}
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
              ) : (
                <div className="flex min-h-0 flex-col gap-2 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                  {!canManage && (
                    <p className="pb-2 text-sm text-text-secondary">{disabledReason}</p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={!canManage}
                    onClick={openEdit}
                  >
                    <Pencil aria-hidden="true" />
                    Edit User
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    disabled={!canManage}
                    onClick={() => {
                      resetAndClose()
                      deleteConfirmation.onOpen()
                    }}
                  >
                    <Trash2 aria-hidden="true" />
                    Delete User
                  </Button>
                </div>
              )}

              {editing && (
                <footer className="flex shrink-0 gap-3 border-t border-border p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={updateUser.isPending}
                    onClick={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={!isDirty || !isValid || updateUser.isPending}
                  >
                    {updateUser.isPending && <Spinner className="size-4" />}
                    {updateUser.isPending ? 'Saving…' : 'Save'}
                  </Button>
                </footer>
              )}
            </form>
          </div>,
          document.body,
        )}

      <ConfirmationDialog
        open={deleteConfirmation.open}
        title="Delete user?"
        description="This action cannot be undone."
        icon={Trash2}
        variant="danger"
        confirmText="Delete user"
        loading={deleteUser.isPending}
        onClose={() => {
          if (!deleteUser.isPending) {
            deleteConfirmation.onClose()
            setDeleteError(undefined)
          }
        }}
        onConfirm={() => void remove()}
      >
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4">
          <p className="text-sm text-text-secondary">
            <strong className="font-medium text-text-heading">{user.fullName}</strong> will lose
            access to this account immediately.
          </p>
        </div>
        {deleteError && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {deleteError}
          </p>
        )}
      </ConfirmationDialog>
    </>
  )
}

function toFormValues(user: UserSummary): EditUserFormValues {
  return {
    username: user.username,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    role: user.role === 'admin' ? 'admin' : 'member',
  }
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
