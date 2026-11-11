import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateFuelProductDocument,
  CreatePumpMeterDocument,
  DeactivateFuelProductDocument,
  DeactivatePumpMeterDocument,
  FuelSetupDocument,
  UpdateFuelProductDocument,
  type CreateFuelProductInput,
  type CreatePumpMeterInput,
  type DeactivateFuelSetupInput,
  type UpdateFuelProductInput,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

const fuelSetupKey = (tenantId: string) => ['fuel-setup', tenantId] as const

export function useFuelSetupQuery(tenantId: string) {
  return useQuery({
    queryKey: fuelSetupKey(tenantId),
    queryFn: async () => (await graphqlClient.request(FuelSetupDocument, undefined, { tenantId })).fuelSetup,
  })
}

function useFuelSetupMutation<T>(tenantId: string, mutationFn: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn, onSuccess: async () => queryClient.invalidateQueries({ queryKey: fuelSetupKey(tenantId) }) })
}

export function useCreateFuelProductMutation(tenantId: string) {
  return useFuelSetupMutation(tenantId, async (input: CreateFuelProductInput) =>
    (await graphqlClient.request(CreateFuelProductDocument, { input }, { tenantId })).createFuelProduct,
  )
}

export function useUpdateFuelProductMutation(tenantId: string) {
  return useFuelSetupMutation(tenantId, async (input: UpdateFuelProductInput) =>
    (await graphqlClient.request(UpdateFuelProductDocument, { input }, { tenantId })).updateFuelProduct,
  )
}

export function useDeactivateFuelProductMutation(tenantId: string) {
  return useFuelSetupMutation(tenantId, async (input: DeactivateFuelSetupInput) =>
    (await graphqlClient.request(DeactivateFuelProductDocument, { input }, { tenantId })).deactivateFuelProduct,
  )
}

export function useCreatePumpMeterMutation(tenantId: string) {
  return useFuelSetupMutation(tenantId, async (input: CreatePumpMeterInput) =>
    (await graphqlClient.request(CreatePumpMeterDocument, { input }, { tenantId })).createPumpMeter,
  )
}

export function useDeactivatePumpMeterMutation(tenantId: string) {
  return useFuelSetupMutation(tenantId, async (input: DeactivateFuelSetupInput) =>
    (await graphqlClient.request(DeactivatePumpMeterDocument, { input }, { tenantId })).deactivatePumpMeter,
  )
}
