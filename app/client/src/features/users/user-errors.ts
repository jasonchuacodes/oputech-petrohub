import { ClientError } from 'graphql-request'

export function isUsernameConflict(error: unknown): boolean {
  if (!(error instanceof ClientError)) return false

  return Boolean(
    error.response.errors?.some((item) => {
      if (/username.+already|already.+username/i.test(item.message)) return true
      const originalError = item.extensions?.originalError
      return (
        typeof originalError === 'object' &&
        originalError !== null &&
        'code' in originalError &&
        originalError.code === 'CONFLICT'
      )
    }),
  )
}
