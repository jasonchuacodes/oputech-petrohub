import type { Metadata } from 'next'
import { MePage } from '~/features/account/me-page'

export const metadata: Metadata = { title: 'Me' }

export default function MeRoute() {
  return <MePage />
}
