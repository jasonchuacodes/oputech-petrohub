import type { Metadata } from 'next'
import { AccountSettingsPage } from '~/features/account/account-settings'

export const metadata: Metadata = { title: 'Account Settings' }

export default function AccountSettingsRoute() {
  return <AccountSettingsPage />
}
