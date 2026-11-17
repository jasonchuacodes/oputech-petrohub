import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  MyProfileDocument,
  UpdateMyProfileDocument,
  type MyProfileQuery,
  type UpdateMyProfileInput,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'
import { useAuth } from '../auth/auth-context'

export type MyProfile = MyProfileQuery['myProfile']

const myProfileKey = ['account', 'profile'] as const

export function useMyProfileQuery() {
  return useQuery({
    queryKey: myProfileKey,
    queryFn: async () => (await graphqlClient.request(MyProfileDocument)).myProfile,
    refetchOnWindowFocus: false,
  })
}

export function useUpdateMyProfileMutation() {
  const auth = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateMyProfileInput) =>
      (await graphqlClient.request(UpdateMyProfileDocument, { input })).updateMyProfile,
    onSuccess: (profile) => {
      auth.updateProfile({
        firstName: profile.firstName ?? undefined,
        lastName: profile.lastName ?? undefined,
        fullName: profile.fullName,
      })
      void queryClient.invalidateQueries({ queryKey: myProfileKey })
    },
  })
}
