import type { AuthenticatedActor, AuthorizedTenant } from '../modules/auth/auth.types'

declare global {
  namespace Express {
    interface Request {
      actor?: AuthenticatedActor
      authorizedTenant?: AuthorizedTenant
    }
  }
}

export {}
