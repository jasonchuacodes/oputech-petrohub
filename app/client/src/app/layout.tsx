import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ServiceWorkerRegistration } from '~/components/pwa/service-worker-registration'
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
  icons: {
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
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
        <ServiceWorkerRegistration />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
