import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from './user.api';

// Queries

// Mutations
const useCreateUserMutation = ({ tenantId }: { tenantId?: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenantUsers', tenantId] });
    },
  });
};

export { useCreateUserMutation };
