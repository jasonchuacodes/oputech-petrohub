'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '~/features/auth/auth-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-center"
          offset={{ top: 'calc(1rem + env(safe-area-inset-top))' }}
          mobileOffset={{ top: 'calc(0.75rem + env(safe-area-inset-top))', left: 16, right: 16 }}
          gap={8}
          visibleToasts={3}
          icons={{
            success: <CircleCheck aria-hidden="true" />,
            error: <CircleAlert aria-hidden="true" />,
            warning: <TriangleAlert aria-hidden="true" />,
            info: <Info aria-hidden="true" />,
            loading: <LoaderCircle aria-hidden="true" className="animate-spin" />,
          }}
          toastOptions={{
            duration: 4_000,
            unstyled: true,
            classNames: {
              toast:
                'flex w-full items-start gap-3 rounded-md border border-border bg-card p-4 font-sans text-foreground shadow-lg',
              content: 'min-w-0 flex-1',
              title: 'text-sm font-medium leading-5 text-text-heading',
              description: 'mt-0.5 text-sm leading-5 text-text-secondary',
              icon: 'mt-0.5 flex size-5 shrink-0 items-center justify-center [&>svg]:size-5',
              success: '[&_[data-icon]]:text-status-success',
              error: '[&_[data-icon]]:text-status-error',
              warning: '[&_[data-icon]]:text-status-warning',
              info: '[&_[data-icon]]:text-status-info',
              loading: '[&_[data-icon]]:text-primary',
              actionButton:
                'ml-auto h-8 shrink-0 rounded-sm bg-brand px-3 text-sm font-medium text-white outline-none hover:bg-brand-hover focus-visible:ring-3 focus-visible:ring-ring/40',
              cancelButton:
                'ml-auto h-8 shrink-0 rounded-sm border border-border bg-card px-3 text-sm font-medium outline-none hover:bg-surface-hover focus-visible:ring-3 focus-visible:ring-ring/40',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
