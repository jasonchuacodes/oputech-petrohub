import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { ClientError, GraphQLClient, type RequestOptions } from 'graphql-request'
import {
  AuthenticationRequiredError,
  getAuthSession,
} from '~/features/auth/auth-session'

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql'
const client = new GraphQLClient(graphqlUrl, {
  cache: 'no-store',
  credentials: 'include',
})

async function request<TResult, TVariables extends object>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
): Promise<TResult> {
  const session = getAuthSession()
  const accessToken = await session.getAccessToken()

  try {
    return await requestWithToken(document, variables, accessToken)
  } catch (error) {
    if (!isAuthenticationError(error)) throw error
    const nextAccessToken = await session.recoverAccessToken(accessToken)
    try {
      return await requestWithToken(document, variables, nextAccessToken)
    } catch (retryError) {
      if (isAuthenticationError(retryError)) {
        session.invalidate()
        throw new AuthenticationRequiredError()
      }
      throw retryError
    }
  }
}

function requestWithToken<TResult, TVariables extends object>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables | undefined,
  accessToken: string,
): Promise<TResult> {
  return client.request({
    document,
    variables,
    requestHeaders: { Authorization: `Bearer ${accessToken}` },
  } as unknown as RequestOptions<TVariables, TResult>)
}

function isAuthenticationError(error: unknown): boolean {
  if (!(error instanceof ClientError)) return false
  if (error.response.status === 401) return true
  return Boolean(
    error.response.errors?.some((item) => {
      if (item.extensions?.code === 'UNAUTHENTICATED') return true
      const originalError = item.extensions?.originalError
      return (
        typeof originalError === 'object' &&
        originalError !== null &&
        'code' in originalError &&
        originalError.code === 'INVALID_SESSION'
      )
    }),
  )
}

export const graphqlClient = { request }
