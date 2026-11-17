import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Pencil } from 'lucide-react'
import { useCallback, useEffect, type ReactNode } from 'react'
import { useForm, useWatch, type UseFormRegisterReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Sheet } from '~/components/ui/sheet'
import { Spinner } from '~/components/ui/spinner'
import { Textarea } from '~/components/ui/textarea'
import type { UserRole } from '~/generated/graphql'
import { useDisclosure } from '~/hooks/useDisclosure'
import { isUsernameConflict } from '../user-errors'
import {
  useUpdateUserMutation,
  useUserDetailsQuery,
  type UserDetails,
  type UserSummary,
} from '../users.queries'
import {
  editUserFormSchema,
  type EditUserFormInput,
  type EditUserFormValues,
} from './user-form.schema'
import { getRoleLabel, RoleSelectSheet, type ManageableUserRole } from './role-select-sheet'

const assignableRoles = ['member', 'admin'] as const satisfies readonly ManageableUserRole[]
const emptyValues: EditUserFormValues = {
  username: '',
  firstName: '',
  lastName: '',
  role: 'member',
  birthday: '',
  address: '',
  sss: '',
  pagibig: '',
  philhealth: '',
  tin: '',
}

type EditUserSheetProps = {
  tenantId: string
  user: UserSummary
  actorRole: UserRole
  onClose: () => void
}

export function EditUserSheet({ tenantId, user, actorRole, onClose }: EditUserSheetProps) {
  const details = useUserDetailsQuery(tenantId, user.id)
  const updateUser = useUpdateUserMutation()
  const roleOptions = useDisclosure()
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<EditUserFormInput, unknown, EditUserFormValues>({
    defaultValues: emptyValues,
    mode: 'onChange',
    resolver: zodResolver(editUserFormSchema),
  })
  const selectedRole = useWatch({ control, name: 'role' }) ?? 'member'

  useEffect(() => {
    if (details.data && !isDirty) reset(toFormValues(details.data))
  }, [details.data, isDirty, reset])

  const close = useCallback(() => {
    if (updateUser.isPending) return
    roleOptions.onClose()
    onClose()
  }, [onClose, roleOptions, updateUser.isPending])

  const submit = handleSubmit(async (values) => {
    try {
      await updateUser.mutateAsync({
        tenantId,
        input: {
          userId: user.id,
          username: values.username.toLowerCase(),
          firstName: values.firstName || null,
          lastName: values.lastName || null,
          role: actorRole === 'admin' ? 'member' : values.role,
          birthday: values.birthday || null,
          address: values.address || null,
          sss: values.sss || null,
          pagibig: values.pagibig || null,
          philhealth: values.philhealth || null,
          tin: values.tin || null,
        },
      })
      onClose()
      toast.success('User updated successfully')
    } catch (error) {
      if (isUsernameConflict(error)) {
        setError('username', { message: 'This username is already in use.' }, { shouldFocus: true })
        return
      }
      setError('root', { message: 'Unable to update the user. Please try again.' })
    }
  })

  return (
    <Sheet
      open
      title="Edit user"
      description={`Update ${user.fullName}'s account and personal details.`}
      icon={Pencil}
      escapeDisabled={updateUser.isPending || roleOptions.open}
      manageFocus
      onClose={close}
    >
      {details.isPending ? (
        <div className="flex min-h-48 items-center justify-center px-5 pb-5">
          <Spinner className="size-5" />
        </div>
      ) : details.isError ? (
        <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-5 pb-5 text-center">
          <p className="text-sm text-text-secondary">Unable to load user details.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => void details.refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <form
          aria-hidden={roleOptions.open || undefined}
          className={roleOptions.open ? 'invisible flex min-h-0 flex-col' : 'flex min-h-0 flex-col'}
          noValidate
          onSubmit={submit}
        >
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-5">
            <FormSection title="Account">
              <div className="flex flex-col gap-4 md:flex-row">
                <FormField
                  id={`edit-user-username-${user.id}`}
                  label="Username *"
                  error={errors.username?.message}
                  className="min-w-0 flex-1"
                >
                  <Input
                    id={`edit-user-username-${user.id}`}
                    autoCapitalize="none"
                    autoComplete="off"
                    disabled={updateUser.isPending}
                    aria-invalid={Boolean(errors.username)}
                    aria-describedby={
                      errors.username ? `edit-user-username-${user.id}-error` : undefined
                    }
                    {...register('username')}
                  />
                </FormField>
                <FormField
                  id={`edit-user-role-${user.id}`}
                  label="Role"
                  error={errors.role?.message}
                  className="min-w-0 flex-1"
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
              </div>
            </FormSection>

            <FormSection title="Personal information">
              <div className="flex flex-col gap-4 md:flex-row">
                <TextField
                  id={`edit-user-first-name-${user.id}`}
                  label="First name"
                  error={errors.firstName?.message}
                  disabled={updateUser.isPending}
                  registration={register('firstName')}
                />
                <TextField
                  id={`edit-user-last-name-${user.id}`}
                  label="Last name"
                  error={errors.lastName?.message}
                  disabled={updateUser.isPending}
                  registration={register('lastName')}
                />
              </div>
              <FormField
                id={`edit-user-birthday-${user.id}`}
                label="Birthday"
                error={errors.birthday?.message}
              >
                <Input
                  id={`edit-user-birthday-${user.id}`}
                  type="date"
                  disabled={updateUser.isPending}
                  aria-invalid={Boolean(errors.birthday)}
                  aria-describedby={
                    errors.birthday ? `edit-user-birthday-${user.id}-error` : undefined
                  }
                  {...register('birthday')}
                />
              </FormField>
              <FormField
                id={`edit-user-address-${user.id}`}
                label="Address"
                error={errors.address?.message}
              >
                <Textarea
                  id={`edit-user-address-${user.id}`}
                  maxLength={500}
                  disabled={updateUser.isPending}
                  aria-invalid={Boolean(errors.address)}
                  aria-describedby={
                    errors.address ? `edit-user-address-${user.id}-error` : undefined
                  }
                  {...register('address')}
                />
              </FormField>
            </FormSection>

            <FormSection title="Government IDs">
              <div className="flex flex-col gap-4 md:flex-row">
                <TextField
                  id={`edit-user-sss-${user.id}`}
                  label="SSS"
                  error={errors.sss?.message}
                  disabled={updateUser.isPending}
                  registration={register('sss')}
                />
                <TextField
                  id={`edit-user-pagibig-${user.id}`}
                  label="Pag-IBIG"
                  error={errors.pagibig?.message}
                  disabled={updateUser.isPending}
                  registration={register('pagibig')}
                />
              </div>
              <div className="flex flex-col gap-4 md:flex-row">
                <TextField
                  id={`edit-user-philhealth-${user.id}`}
                  label="PhilHealth"
                  error={errors.philhealth?.message}
                  disabled={updateUser.isPending}
                  registration={register('philhealth')}
                />
                <TextField
                  id={`edit-user-tin-${user.id}`}
                  label="TIN"
                  error={errors.tin?.message}
                  disabled={updateUser.isPending}
                  registration={register('tin')}
                />
              </div>
            </FormSection>

            {errors.root?.message && (
              <p role="alert" className="text-sm text-destructive">
                {errors.root.message}
              </p>
            )}
          </div>

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
        </form>
      )}

      <RoleSelectSheet
        open={roleOptions.open}
        value={selectedRole}
        roles={assignableRoles}
        onSelect={(role) => setValue('role', role, { shouldDirty: true, shouldValidate: true })}
        onClose={roleOptions.onClose}
      />
    </Sheet>
  )
}

function toFormValues(user: UserDetails): EditUserFormValues {
  return {
    username: user.username,
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    role: user.role === 'admin' ? 'admin' : 'member',
    birthday: user.birthday ?? '',
    address: user.address ?? '',
    sss: user.sss ?? '',
    pagibig: user.pagibig ?? '',
    philhealth: user.philhealth ?? '',
    tin: user.tin ?? '',
  }
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section>
      <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-text-heading">
        {title}
      </h3>
      <div className="space-y-4 rounded-md border border-border/70 bg-surface-subtle p-4">
        {children}
      </div>
    </section>
  )
}

function TextField({
  id,
  label,
  error,
  disabled,
  registration,
}: {
  id: string
  label: string
  error?: string
  disabled: boolean
  registration: UseFormRegisterReturn
}) {
  return (
    <FormField id={id} label={label} error={error} className="min-w-0 flex-1">
      <Input
        id={id}
        maxLength={80}
        autoComplete="off"
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...registration}
      />
    </FormField>
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
