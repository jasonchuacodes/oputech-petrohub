import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateFuelProductDocument,
  CreatePumpMeterDocument,
  ChangeFuelPriceDocument,
  DeactivateFuelProductDocument,
  DeactivatePumpMeterDocument,
  FuelSetupDocument,
  UpdateFuelProductDocument,
  UpdatePumpMeterDocument,
  type CreateFuelProductInput,
  type CreatePumpMeterInput,
  type ChangeFuelPriceInput,
  type DeactivateFuelSetupInput,
  type UpdateFuelProductInput,
  type UpdatePumpMeterInput,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'
import { reportKeys } from '../reports/reports.queries'

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

export function useChangeFuelPriceMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: ChangeFuelPriceInput) =>
      (await graphqlClient.request(ChangeFuelPriceDocument, { input }, { tenantId })).changeFuelPrice,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: fuelSetupKey(tenantId) }),
        queryClient.invalidateQueries({ queryKey: reportKeys.all(tenantId) }),
      ])
    },
  })
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

export function useUpdatePumpMeterMutation(tenantId: string) {
  return useFuelSetupMutation(tenantId, async (input: UpdatePumpMeterInput) =>
    (await graphqlClient.request(UpdatePumpMeterDocument, { input }, { tenantId })).updatePumpMeter,
  )
}

export function useDeactivatePumpMeterMutation(tenantId: string) {
  return useFuelSetupMutation(tenantId, async (input: DeactivateFuelSetupInput) =>
    (await graphqlClient.request(DeactivatePumpMeterDocument, { input }, { tenantId })).deactivatePumpMeter,
  )
}
