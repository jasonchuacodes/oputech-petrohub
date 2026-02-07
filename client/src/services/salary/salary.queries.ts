import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSalaryRate, getCurrentSalaryRate, getSalaryRates } from './salary.api';
import type { CreateSalaryRateInput } from './salary.types';

export const salaryKeys = {
  all: ['salary-rates'] as const,
  current: (userId: string, tenantId: string) =>
    [...salaryKeys.all, 'current', userId, tenantId] as const,
  history: (userId: string, tenantId: string) =>
    [...salaryKeys.all, 'history', userId, tenantId] as const,
};

export const useGetCurrentSalaryRateQuery = (
  userId: string | undefined,
  tenantId: string | undefined
) => {
  return useQuery({
    queryKey: salaryKeys.current(userId || '', tenantId || ''),
    queryFn: () => getCurrentSalaryRate(userId!, tenantId!),
    enabled: !!userId && !!tenantId,
  });
};

export const useCreateSalaryRateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSalaryRateInput) => createSalaryRate(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: salaryKeys.current(variables.userId, variables.tenantId),
      });
      queryClient.invalidateQueries({
        queryKey: salaryKeys.history(variables.userId, variables.tenantId),
      });
    },
  });
};
