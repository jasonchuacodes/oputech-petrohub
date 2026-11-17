import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { AppProviders } from '~/providers/app-providers'
import '~/styles/base.css'

export const metadata: Metadata = {
  applicationName: 'Petrohub',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Petrohub',
  },
  description: 'Mobile-first station operations and shift reporting.',
  other: { 'mobile-web-app-capable': 'yes' },
  title: {
    default: 'Petrohub',
    template: '%s · Petrohub',
  },
}

export const viewport: Viewport = {
  themeColor: '#17434d',
  viewportFit: 'cover',
  width: 'device-width',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
