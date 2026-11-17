import { Eye, KeyRound, MoreVertical, Pencil, UserRoundCog, UserX } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Sheet } from '~/components/ui/sheet'
import type { UserRole } from '~/generated/graphql'
import { useDisclosure } from '~/hooks/useDisclosure'
import type { UserSummary } from '../users.queries'
import { DeactivateUserSheet } from './deactivate-user-sheet'
import { EditUserSheet } from './edit-user-sheet'
import { ResetPasswordSheet } from './reset-password-sheet'
import { ViewUserSheet } from './view-user-sheet'

type UserActionsProps = {
  tenantId: string
  timezone: string
  user: UserSummary
  actorId: string
  actorRole: UserRole
}

export function UserActions({
  tenantId,
  timezone,
  user,
  actorId,
  actorRole,
}: UserActionsProps) {
  const actions = useDisclosure()
  const deactivation = useDisclosure()
  const passwordReset = useDisclosure()
  const [detailsView, setDetailsView] = useState<'view' | 'edit' | null>(null)
  const self = actorId === user.id
  const active = user.tenantMembership?.availability === 'active'
  const canManageRole =
    actorRole === 'superadmin' || (actorRole === 'admin' && user.role === 'member')
  const canManage = !self && canManageRole && active

  const openDetails = (view: 'view' | 'edit') => {
    if (view === 'edit' && !canManage) return
    actions.onClose()
    setDetailsView(view)
  }
  const openPasswordReset = () => {
    if (!canManage) return
    actions.onClose()
    passwordReset.onOpen()
  }
  const openDeactivation = () => {
    if (!canManage) return
    actions.onClose()
    deactivation.onOpen()
  }

  const disabledReason = self
    ? 'You cannot manage your own account here.'
    : !active
      ? 'Inactive users can only be viewed.'
      : 'Only super administrators can manage administrator accounts.'

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Actions for ${user.fullName}`}
        title="User actions"
        className="wide:hidden"
        onClick={actions.onOpen}
      >
        <MoreVertical aria-hidden="true" className="size-5" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Actions for ${user.fullName}`}
            title="User actions"
            className="hidden wide:inline-flex"
          >
            <MoreVertical aria-hidden="true" className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => openDetails('view')}>
            <Eye aria-hidden="true" /> View
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canManage} onSelect={() => openDetails('edit')}>
            <Pencil aria-hidden="true" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!canManage} onSelect={openPasswordReset}>
            <KeyRound aria-hidden="true" /> Reset password
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            disabled={!canManage}
            onSelect={openDeactivation}
          >
            <UserX aria-hidden="true" /> Deactivate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {actions.open && (
        <Sheet
          open
          title="User actions"
          description={user.fullName}
          icon={UserRoundCog}
          manageFocus
          onClose={actions.onClose}
        >
          <div className="flex min-h-0 flex-col gap-2 overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {!canManage && <p className="pb-2 text-sm text-text-secondary">{disabledReason}</p>}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => openDetails('view')}
            >
              <Eye aria-hidden="true" />
              View User
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!canManage}
              onClick={() => openDetails('edit')}
            >
              <Pencil aria-hidden="true" />
              Edit User
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={!canManage}
              onClick={openPasswordReset}
            >
              <KeyRound aria-hidden="true" />
              Reset Password
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={!canManage}
              onClick={openDeactivation}
            >
              <UserX aria-hidden="true" />
              Deactivate User
            </Button>
          </div>
        </Sheet>
      )}

      {detailsView === 'view' && (
        <ViewUserSheet tenantId={tenantId} user={user} onClose={() => setDetailsView(null)} />
      )}
      {detailsView === 'edit' && (
        <EditUserSheet
          tenantId={tenantId}
          user={user}
          actorRole={actorRole}
          onClose={() => setDetailsView(null)}
        />
      )}

      <DeactivateUserSheet
        open={deactivation.open}
        tenantId={tenantId}
        timezone={timezone}
        user={user}
        onClose={deactivation.onClose}
      />

      <ResetPasswordSheet
        open={passwordReset.open}
        tenantId={tenantId}
        user={user}
        onClose={passwordReset.onClose}
      />
    </>
  )
}
