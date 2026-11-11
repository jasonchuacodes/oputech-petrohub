import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateInventoryProductDocument,
  DeactivateInventoryProductDocument,
  InventoryProductsDocument,
  RecordStockMovementDocument,
  StockMovementsDocument,
  UpdateInventoryProductDocument,
  type CreateInventoryProductInput,
  type DeactivateInventoryProductInput,
  type InventoryProductsInput,
  type RecordStockMovementInput,
  type StockMovementsInput,
  type UpdateInventoryProductInput,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

export const inventoryKeys = {
  all: (tenantId: string) => ['inventory', tenantId] as const,
  products: (tenantId: string, input: InventoryProductsInput) => ['inventory', tenantId, 'products', input] as const,
  movements: (tenantId: string, input: StockMovementsInput) => ['inventory', tenantId, 'movements', input] as const,
}

export function useInventoryProductsQuery(tenantId: string, input: InventoryProductsInput) {
  return useQuery({
    queryKey: inventoryKeys.products(tenantId, input),
    queryFn: async () => (await graphqlClient.request(InventoryProductsDocument, { input }, { tenantId })).inventoryProducts,
  })
}

export function useStockMovementsQuery(tenantId: string, input: StockMovementsInput, enabled = true) {
  return useQuery({
    queryKey: inventoryKeys.movements(tenantId, input),
    queryFn: async () => (await graphqlClient.request(StockMovementsDocument, { input }, { tenantId })).stockMovements,
    enabled,
  })
}

function useInventoryMutation<T>(tenantId: string, mutationFn: (input: T) => Promise<unknown>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: inventoryKeys.all(tenantId) }),
  })
}

export function useCreateInventoryProductMutation(tenantId: string) {
  return useInventoryMutation(tenantId, async (input: CreateInventoryProductInput) =>
    (await graphqlClient.request(CreateInventoryProductDocument, { input }, { tenantId })).createInventoryProduct,
  )
}

export function useUpdateInventoryProductMutation(tenantId: string) {
  return useInventoryMutation(tenantId, async (input: UpdateInventoryProductInput) =>
    (await graphqlClient.request(UpdateInventoryProductDocument, { input }, { tenantId })).updateInventoryProduct,
  )
}

export function useDeactivateInventoryProductMutation(tenantId: string) {
  return useInventoryMutation(tenantId, async (input: DeactivateInventoryProductInput) =>
    (await graphqlClient.request(DeactivateInventoryProductDocument, { input }, { tenantId })).deactivateInventoryProduct,
  )
}

export function useRecordStockMovementMutation(tenantId: string) {
  return useInventoryMutation(tenantId, async (input: RecordStockMovementInput) =>
    (await graphqlClient.request(RecordStockMovementDocument, { input }, { tenantId })).recordStockMovement,
  )
}
