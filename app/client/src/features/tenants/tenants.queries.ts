import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateTenantDocument,
  CreateShiftDocument,
  DeleteShiftDocument,
  DeleteTenantDocument,
  ShiftsDocument,
  TenantsDocument,
  UpdateTenantDocument,
  UpdateShiftDocument,
  type CreateShiftInput,
  type CreateTenantMutation,
  type UpdateShiftInput,
  type ShiftsQuery,
  type TenantsQuery,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'
import { reportKeys } from '../reports/reports.queries'

export type TenantAccess = TenantsQuery['tenants'][number]
export type TenantSummary = CreateTenantMutation['createTenant']
export type ShiftRecord = ShiftsQuery['shifts'][number]

const tenantKeys = {
  all: ['tenants'] as const,
  shifts: (tenantId: string) => ['tenants', tenantId, 'shifts'] as const,
}

export function useShiftsQuery(tenantId: string, enabled = true) {
  return useQuery({
    queryKey: tenantKeys.shifts(tenantId),
    queryFn: async () =>
      (await graphqlClient.request(ShiftsDocument, undefined, { tenantId })).shifts,
    enabled,
  })
}

export function useCreateShiftMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateShiftInput) =>
      (await graphqlClient.request(CreateShiftDocument, { input }, { tenantId })).createShift,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tenantKeys.shifts(tenantId) }),
        queryClient.invalidateQueries({ queryKey: reportKeys.context(tenantId) }),
      ])
    },
  })
}

export function useUpdateShiftMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateShiftInput) =>
      (await graphqlClient.request(UpdateShiftDocument, { input }, { tenantId })).updateShift,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tenantKeys.shifts(tenantId) }),
        queryClient.invalidateQueries({ queryKey: reportKeys.context(tenantId) }),
      ])
    },
  })
}

export function useDeleteShiftMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (shiftId: string) =>
      (await graphqlClient.request(DeleteShiftDocument, { input: { shiftId } }, { tenantId }))
        .deleteShift,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tenantKeys.shifts(tenantId) }),
        queryClient.invalidateQueries({ queryKey: reportKeys.context(tenantId) }),
      ])
    },
  })
}

export function useTenantsQuery() {
  return useQuery({
    queryKey: tenantKeys.all,
    queryFn: async () => (await graphqlClient.request(TenantsDocument)).tenants,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (name: string) =>
      (await graphqlClient.request(CreateTenantDocument, { input: { name } })).createTenant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}

export function useUpdateTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { tenantId: string; name: string }) =>
      (await graphqlClient.request(UpdateTenantDocument, { input })).updateTenant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}

export function useDeleteTenantMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (tenantId: string) =>
      (await graphqlClient.request(DeleteTenantDocument, { input: { tenantId } })).deleteTenant,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tenantKeys.all })
    },
  })
}
