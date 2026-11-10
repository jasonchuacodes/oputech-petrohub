'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { Spinner } from '~/components/ui/spinner'
import { useSessionQuery } from './auth.queries'
import { getAuthenticatedRedirect } from './auth-routing'

export function AuthGate({ children }: { children: ReactNode }) {
  const session = useSessionQuery()
  const pathname = usePathname()
  const router = useRouter()
  const destination = session.data
    ? getAuthenticatedRedirect(session.data, pathname)
    : session.isPending
      ? null
      : '/login'

  useEffect(() => {
    if (destination) router.replace(destination)
  }, [destination, router])

  if (session.isPending || destination) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  return children
}
