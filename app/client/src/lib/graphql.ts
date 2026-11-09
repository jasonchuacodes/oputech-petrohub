import { GraphQLClient, type RequestDocument } from 'graphql-request'

const client = new GraphQLClient('/graphql', { credentials: 'include' })

export function graphqlQuery<TData>(document: RequestDocument, tenantId?: string): Promise<TData> {
  return client.request<TData>(document, {}, tenantId ? { 'x-tenant-id': tenantId } : undefined)
}
