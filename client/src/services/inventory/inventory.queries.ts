import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getInventoriesByTenantId,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
} from './inventory.api';
import type { CreateInventoryPayload, UpdateInventoryPayload } from './inventory.types';

const useGetInventoriesQuery = (tenantId?: string) => {
  return useQuery({
    queryKey: ['inventories', tenantId],
    queryFn: () => getInventoriesByTenantId(tenantId!),
    enabled: !!tenantId,
  });
};

const useGetInventoryQuery = ({
  inventoryId,
  tenantId,
}: {
  inventoryId?: string;
  tenantId?: string;
}) => {
  return useQuery({
    queryKey: ['inventory', inventoryId, tenantId],
    queryFn: () => getInventoryById(inventoryId!, tenantId!),
    enabled: !!inventoryId && !!tenantId,
  });
};

const useCreateInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryPayload) => createInventory(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventories', variables.tenantId] });
    },
  });
};

const useUpdateInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      inventoryId,
      data,
      tenantId,
    }: {
      inventoryId: string;
      data: UpdateInventoryPayload;
      tenantId: string;
    }) => updateInventory(inventoryId, data, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventories', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.inventoryId, variables.tenantId] });
    },
  });
};

const useDeleteInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ inventoryId, tenantId }: { inventoryId: string; tenantId: string }) =>
      deleteInventory(inventoryId, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventories', variables.tenantId] });
    },
  });
};

export {
  useGetInventoriesQuery,
  useGetInventoryQuery,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
};
