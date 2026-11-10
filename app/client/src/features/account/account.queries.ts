import { useMutation } from '@tanstack/react-query'
import { UpdateMyProfileDocument, type UpdateMyProfileInput } from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'
import { useAuth } from '../auth/auth-context'

export function useUpdateMyProfileMutation() {
  const auth = useAuth()
  return useMutation({
    mutationFn: async (input: UpdateMyProfileInput) =>
      (await graphqlClient.request(UpdateMyProfileDocument, { input })).updateMyProfile,
    onSuccess: (profile) => {
      auth.updateProfile({
        firstName: profile.firstName ?? undefined,
        lastName: profile.lastName ?? undefined,
      })
    },
  })
}
