'use client'

import { WifiOff } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function SessionUnavailable({ retry }: { retry: () => Promise<void> }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <section className="shadow-card w-full max-w-md rounded-md bg-card p-6 text-center">
        <WifiOff aria-hidden="true" className="mx-auto size-8 text-text-tertiary" />
        <h1 className="mt-4 text-lg font-bold text-text-heading">Unable to restore your session</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Check your connection, then try again. You have not been signed out.
        </p>
        <Button className="mt-6 w-full" onClick={() => void retry().catch(() => undefined)}>
          Try again
        </Button>
      </section>
    </main>
  )
}
