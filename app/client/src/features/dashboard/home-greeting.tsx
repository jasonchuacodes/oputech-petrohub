'use client'

import { Bell } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/ui/page-header'
import { useSessionQuery } from '../auth/auth.queries'

export function HomeGreeting() {
  const session = useSessionQuery()
  const user = session.data?.user
  const greetingName = user?.firstName?.trim() || user?.username || 'there'

  return (
    <PageHeader
      title={`Good morning, ${greetingName}`}
      description={user?.username ? `@${user.username}` : undefined}
      action={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications are not available"
          className="wide:size-11"
          disabled
        >
          <Bell aria-hidden="true" />
        </Button>
      }
    />
  )
}
