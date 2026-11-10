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
        activateTenant: session.activateTenant.bind(session),
        changePassword: session.changePassword.bind(session),
      }}
    >
      {children}
    </AuthContext>
  )
}
