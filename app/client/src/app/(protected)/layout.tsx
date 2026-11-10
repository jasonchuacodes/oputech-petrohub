import type { ReactNode } from 'react'
import { AuthGate } from '~/features/auth/auth-gate'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>
}
