import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createTenant } from './tenant.api';

const useCreateTenantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
};

export { useCreateTenantMutation };
