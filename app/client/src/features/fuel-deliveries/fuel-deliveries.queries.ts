import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateFuelDeliveryDocument,
  DeleteFuelDeliveryDocument,
  FuelDeliveriesDocument,
  UpdateFuelDeliveryDocument,
  type CreateFuelDeliveryInput,
  type DeleteFuelDeliveryInput,
  type FuelDeliveriesInput,
  type UpdateFuelDeliveryInput,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

export const fuelDeliveryKeys = {
  all: (tenantId: string) => ['fuel-deliveries', tenantId] as const,
  list: (tenantId: string, input: FuelDeliveriesInput) => ['fuel-deliveries', tenantId, input] as const,
}

export const fuelDeliveryPageSize = 20

export function fuelDeliveriesInput(offset = 0): FuelDeliveriesInput {
  return { offset, limit: fuelDeliveryPageSize }
}

export function fuelDeliveriesQueryOptions(tenantId: string, input: FuelDeliveriesInput) {
  return queryOptions({
    queryKey: fuelDeliveryKeys.list(tenantId, input),
    queryFn: async () => (await graphqlClient.request(FuelDeliveriesDocument, { input }, { tenantId })).fuelDeliveries,
  })
}

export function useFuelDeliveriesQuery(tenantId: string, input: FuelDeliveriesInput) {
  return useQuery(fuelDeliveriesQueryOptions(tenantId, input))
}

function useFuelDeliveryMutation<T>(tenantId: string, mutationFn: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: fuelDeliveryKeys.all(tenantId) }),
        queryClient.invalidateQueries({ queryKey: ['fuel-setup', tenantId] }),
      ])
    },
  })
}

export function useCreateFuelDeliveryMutation(tenantId: string) {
  return useFuelDeliveryMutation(tenantId, async (input: CreateFuelDeliveryInput) =>
    (await graphqlClient.request(CreateFuelDeliveryDocument, { input }, { tenantId })).createFuelDelivery,
  )
}

export function useUpdateFuelDeliveryMutation(tenantId: string) {
  return useFuelDeliveryMutation(tenantId, async (input: UpdateFuelDeliveryInput) =>
    (await graphqlClient.request(UpdateFuelDeliveryDocument, { input }, { tenantId })).updateFuelDelivery,
  )
}

export function useDeleteFuelDeliveryMutation(tenantId: string) {
  return useFuelDeliveryMutation(tenantId, async (input: DeleteFuelDeliveryInput) =>
    (await graphqlClient.request(DeleteFuelDeliveryDocument, { input }, { tenantId })).deleteFuelDelivery,
  )
}
