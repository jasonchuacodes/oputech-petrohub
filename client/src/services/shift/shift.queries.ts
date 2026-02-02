import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getShiftsByTenantId,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  getShiftPeriods,
} from './shift.api';
import type { CreateShiftPayload, UpdateShiftPayload } from './shift.types';

const useGetShiftsQuery = (tenantId?: string) => {
  return useQuery({
    queryKey: ['shifts', tenantId],
    queryFn: () => getShiftsByTenantId(tenantId!),
    enabled: !!tenantId,
  });
};

const useGetShiftQuery = ({
  shiftId,
  tenantId,
}: {
  shiftId?: string;
  tenantId?: string;
}) => {
  return useQuery({
    queryKey: ['shift', shiftId, tenantId],
    queryFn: () => getShiftById(shiftId!, tenantId!),
    enabled: !!shiftId && !!tenantId,
  });
};

const useCreateShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShiftPayload) => createShift(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shifts', variables.tenantId] });
    },
  });
};

const useUpdateShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shiftId,
      data,
      tenantId,
    }: {
      shiftId: string;
      data: UpdateShiftPayload;
      tenantId: string;
    }) => updateShift(shiftId, data, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shifts', variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ['shift', variables.shiftId] });
    },
  });
};

const useDeleteShiftMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftId, tenantId }: { shiftId: string; tenantId: string }) =>
      deleteShift(shiftId, tenantId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shifts', variables.tenantId] });
    },
  });
};

const useShiftPeriodsQuery = (shiftDate: string | null) => {
  return useQuery({
    queryKey: ['shift-periods', shiftDate],
    queryFn: () => getShiftPeriods(shiftDate!),
    enabled: !!shiftDate,
  });
};

export {
  useGetShiftsQuery,
  useGetShiftQuery,
  useCreateShiftMutation,
  useUpdateShiftMutation,
  useDeleteShiftMutation,
  useShiftPeriodsQuery,
};
