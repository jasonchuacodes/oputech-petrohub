import {
  AuthApiError,
  changePasswordRequest,
  loginSession,
  logoutSession,
  refreshSession,
} from './auth.api'
import type { Session, SessionResponse } from './auth.types'

export type AuthStatus =
  | 'bootstrapping'
  | 'anonymous'
  | 'authenticating'
  | 'authenticated'
  | 'refreshing'
  | 'signing-out'
  | 'unavailable'

export type AuthSessionSnapshot = {
  status: AuthStatus
  session: Session | null
  generation: number
  sessionError: 'invalid-session' | null
}

type Credential = { accessToken: string; expiresAt: number }

export class AuthenticationRequiredError extends Error {
  constructor() {
    super('Authentication is required')
    this.name = 'AuthenticationRequiredError'
  }
}

const EXPIRY_SKEW_MILLISECONDS = 30_000
const SERVER_SNAPSHOT: AuthSessionSnapshot = {
  status: 'bootstrapping',
  session: null,
  generation: 0,
  sessionError: null,
}

class AuthSession {
  private snapshot: AuthSessionSnapshot = SERVER_SNAPSHOT
  private credential: Credential | null = null
  private listeners = new Set<() => void>()
  private bootstrapPromise: Promise<void> | null = null
  private refreshPromise: Promise<string> | null = null
  private cookieMutation: Promise<void> = Promise.resolve()
  private operationEpoch = 0

  getSnapshot = () => this.snapshot
  getServerSnapshot = () => SERVER_SNAPSHOT
  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  bootstrap = () => {
    this.bootstrapPromise ??= this.rotateCredential('bootstrap')
      .then(() => undefined)
      .catch(() => undefined)
    return this.bootstrapPromise
  }

  async login(input: { username: string; password: string }): Promise<SessionResponse> {
    const operationEpoch = ++this.operationEpoch
    this.clearCredential('authenticating', this.snapshot.session !== null)
    try {
      const response = await this.enqueueCookieMutation(() => loginSession(input))
      if (operationEpoch !== this.operationEpoch) throw new AuthenticationRequiredError()
      this.installSession(response, true)
      return response
    } catch (error) {
      if (operationEpoch === this.operationEpoch) this.clearCredential('anonymous')
      throw error
    }
  }

  async logout(): Promise<void> {
    const hadSession = this.snapshot.session !== null
    this.operationEpoch += 1
    this.clearCredential('signing-out', hadSession)
    if (this.refreshPromise) await this.refreshPromise.catch(() => undefined)

    try {
      await this.enqueueCookieMutation(() => logoutSession())
    } catch (error) {
      if (!(error instanceof AuthApiError && error.status === 401)) throw error
    } finally {
      this.update({ ...this.snapshot, status: 'anonymous', session: null, sessionError: null })
    }
  }

  async changePassword(input: { currentPassword: string; newPassword: string }): Promise<void> {
    const accessToken = await this.getAccessToken()
    await changePasswordRequest(accessToken, input)
    this.invalidate()
  }

  retryBootstrap = async () => {
    this.update({ ...this.snapshot, status: 'bootstrapping', session: null, sessionError: null })
    await this.rotateCredential('bootstrap')
  }

  async getAccessToken(): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise
    if (this.snapshot.status === 'bootstrapping') await this.bootstrap()
    if (
      this.credential &&
      this.credential.expiresAt > Date.now() + EXPIRY_SKEW_MILLISECONDS
    ) {
      return this.credential.accessToken
    }
    if (!this.credential && this.snapshot.status !== 'authenticated') {
      throw new AuthenticationRequiredError()
    }
    return this.rotateCredential('refresh')
  }

  recoverAccessToken(rejectedToken: string): Promise<string> {
    if (
      this.credential &&
      this.credential.accessToken !== rejectedToken &&
      this.credential.expiresAt > Date.now()
    ) {
      return Promise.resolve(this.credential.accessToken)
    }
    return this.rotateCredential('refresh')
  }

  invalidate(): void {
    this.operationEpoch += 1
    this.clearCredential('anonymous', this.snapshot.session !== null, 'invalid-session')
  }

  private rotateCredential(mode: 'bootstrap' | 'refresh'): Promise<string> {
    if (this.refreshPromise) return this.refreshPromise
    const operationEpoch = this.operationEpoch
    if (mode === 'refresh') this.update({ ...this.snapshot, status: 'refreshing' })

    this.refreshPromise = this.enqueueCookieMutation(() => refreshSession())
      .then((response) => {
        if (operationEpoch !== this.operationEpoch) throw new AuthenticationRequiredError()
        this.installSession(response, mode === 'bootstrap')
        return response.accessToken
      })
      .catch((error: unknown) => {
        if (operationEpoch !== this.operationEpoch) throw error
        const status =
          error instanceof AuthApiError && error.status === 401 ? 'anonymous' : 'unavailable'
        this.clearCredential(
          status,
          this.snapshot.session !== null,
          status === 'anonymous' ? 'invalid-session' : null,
        )
        throw error
      })
      .finally(() => {
        this.refreshPromise = null
      })
    return this.refreshPromise
  }

  private installSession(response: SessionResponse, newIdentity: boolean): void {
    const expiresAt = Date.parse(response.dateTimeExpiration)
    this.credential = {
      accessToken: response.accessToken,
      expiresAt: Number.isNaN(expiresAt) ? Date.now() : expiresAt,
    }
    this.update({
      status: 'authenticated',
      session: { user: response.user, tenantAccess: response.tenantAccess },
      sessionError: null,
      generation: newIdentity ? this.snapshot.generation + 1 : this.snapshot.generation,
    })
  }

  private clearCredential(
    status: AuthStatus,
    incrementGeneration = false,
    sessionError: AuthSessionSnapshot['sessionError'] = null,
  ): void {
    this.credential = null
    this.update({
      status,
      session: null,
      sessionError,
      generation: incrementGeneration
        ? this.snapshot.generation + 1
        : this.snapshot.generation,
    })
  }

  private update(snapshot: AuthSessionSnapshot): void {
    this.snapshot = snapshot
    this.listeners.forEach((listener) => listener())
  }

  private enqueueCookieMutation<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.cookieMutation
      .catch(() => undefined)
      .then(() => withAuthCookieLock(operation))
    this.cookieMutation = result.then(
      () => undefined,
      () => undefined,
    )
    return result
  }
}

async function withAuthCookieLock<T>(operation: () => Promise<T>): Promise<T> {
  if (typeof navigator === 'undefined' || !('locks' in navigator)) return operation()
  return navigator.locks.request<Promise<T>>('petromate-auth-cookie-mutation', operation)
}

let browserSession: AuthSession | undefined

export function getAuthSession(): AuthSession {
  if (typeof window === 'undefined') return new AuthSession()
  browserSession ??= new AuthSession()
  return browserSession
}

export function isTerminalAuthError(error: unknown): boolean {
  return (
    error instanceof AuthenticationRequiredError ||
    (error instanceof AuthApiError && error.status === 401)
  )
}
