import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getStockInventoriesByTenantId,
  getStockInventoryById,
  createStockInventory,
  updateStockInventory,
  deleteStockInventory,
} from './inventory.api';
import type { CreateStockInventoryPayload, UpdateStockInventoryPayload } from './inventory.types';

const useGetStockInventoriesQuery = (tenantId?: string) => {
  return useQuery({
    queryKey: ['stock-inventories', tenantId],
    queryFn: () => getStockInventoriesByTenantId(tenantId!),
    enabled: !!tenantId,
  });
};

const useGetStockInventoryQuery = ({
  inventoryId,
  tenantId,
}: {
  inventoryId?: string;
  tenantId?: string;
}) => {
  return useQuery({
    queryKey: ['stock-inventory', inventoryId, tenantId],
    queryFn: () => getStockInventoryById(inventoryId!, tenantId!),
    enabled: !!inventoryId && !!tenantId,
  });
};

const useCreateStockInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStockInventoryPayload) => createStockInventory(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stock-inventories', variables.tenantId] });
    },
  });
};

const useUpdateStockInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      inventoryId,
      data,
      tenantId,
    }: {
      inventoryId: string;
      data: UpdateStockInventoryPayload;
      tenantId: string;
    }) => updateStockInventory(inventoryId, data, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stock-inventories', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['stock-inventory', variables.inventoryId, variables.tenantId] });
    },
  });
};

const useDeleteStockInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inventoryId, tenantId }: { inventoryId: string; tenantId: string }) =>
      deleteStockInventory(inventoryId, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stock-inventories', variables.tenantId] });
    },
  });
};

export {
  useGetStockInventoriesQuery,
  useGetStockInventoryQuery,
  useCreateStockInventoryMutation,
  useUpdateStockInventoryMutation,
  useDeleteStockInventoryMutation,
};
