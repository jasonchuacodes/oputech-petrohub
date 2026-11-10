import type { Metadata } from 'next'
import { ChangePasswordPage } from '~/features/auth/change-password-page'

export const metadata: Metadata = { title: 'Change password' }

export default function ChangePasswordRoute() {
  return <ChangePasswordPage />
}
