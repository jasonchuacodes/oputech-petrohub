'use client'

import { useQueryClient } from '@tanstack/react-query'
import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { AuthContext } from './auth-context'
import { getAuthSession } from './auth-session'

const RESUME_RETRY_DELAY_MILLISECONDS = 1_500

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session] = useState(getAuthSession)
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    session.getServerSnapshot,
  )
  const queryClient = useQueryClient()
  const previousGeneration = useRef(snapshot.generation)

  useEffect(() => {
    void session.bootstrap()
  }, [session])

  useEffect(() => {
    let retryTimer: number | undefined

    const scheduleRetry = () => {
      if (retryTimer !== undefined) window.clearTimeout(retryTimer)
      retryTimer = window.setTimeout(() => {
        retryTimer = undefined
        if (document.visibilityState === 'visible') {
          void session.resume().catch(() => undefined)
        }
      }, RESUME_RETRY_DELAY_MILLISECONDS)
    }

    const resume = () => {
      if (document.visibilityState !== 'visible') return
      if (retryTimer !== undefined) {
        window.clearTimeout(retryTimer)
        retryTimer = undefined
      }
      void session.resume().catch(scheduleRetry)
    }

    document.addEventListener('visibilitychange', resume)
    window.addEventListener('online', resume)
    window.addEventListener('pageshow', resume)
    return () => {
      document.removeEventListener('visibilitychange', resume)
      window.removeEventListener('online', resume)
      window.removeEventListener('pageshow', resume)
      if (retryTimer !== undefined) window.clearTimeout(retryTimer)
    }
  }, [session])

  useEffect(() => {
    if (previousGeneration.current !== snapshot.generation) {
      queryClient.clear()
      previousGeneration.current = snapshot.generation
    }
  }, [queryClient, snapshot.generation])

  return (
    <AuthContext
      value={{
        ...snapshot,
        login: session.login.bind(session),
        logout: session.logout.bind(session),
        retrySession: session.resume.bind(session),
        activateTenant: session.activateTenant.bind(session),
        changePassword: session.changePassword.bind(session),
        updateProfile: session.updateProfile.bind(session),
      }}
    >
      {children}
    </AuthContext>
  )
}
