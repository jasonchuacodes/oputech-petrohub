import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { ClientError, GraphQLClient, type RequestOptions } from 'graphql-request'
import {
  AuthenticationRequiredError,
  getAuthSession,
} from '~/features/auth/auth-session'

const configuredGraphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL?.trim() || '/graphql'
let client: GraphQLClient | undefined

type RequestContext = {
  tenantId?: string
}

async function request<TResult, TVariables extends object>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  context: RequestContext = {},
): Promise<TResult> {
  const session = getAuthSession()
  const accessToken = await session.getAccessToken()

  try {
    return await requestWithToken(document, variables, accessToken, context)
  } catch (error) {
    if (!isAuthenticationError(error)) throw error
    const nextAccessToken = await session.recoverAccessToken(accessToken)
    try {
      return await requestWithToken(document, variables, nextAccessToken, context)
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
  context: RequestContext,
): Promise<TResult> {
  return getClient().request({
    document,
    variables,
    requestHeaders: {
      Authorization: `Bearer ${accessToken}`,
      ...(context.tenantId ? { 'x-tenant-id': context.tenantId } : {}),
    },
  } as unknown as RequestOptions<TVariables, TResult>)
}

function getClient(): GraphQLClient {
  client ??= new GraphQLClient(resolveBrowserUrl(configuredGraphqlUrl), {
    cache: 'no-store',
    credentials: 'include',
  })
  return client
}

function resolveBrowserUrl(value: string): string {
  if (typeof window === 'undefined') return value
  return new URL(value, window.location.origin).toString()
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
