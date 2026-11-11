import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckInAttendanceDocument,
  CheckOutAttendanceDocument,
  MyAttendanceDocument,
  SetTimesheetDayOverrideDocument,
  TimesheetDaysDocument,
  TimesheetsDocument,
  type SetTimesheetDayOverrideInput,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

export const attendanceKeys = {
  all: (tenantId: string) => ['attendance', tenantId] as const,
  mine: (tenantId: string) => ['attendance', tenantId, 'mine'] as const,
  lists: (tenantId: string) => ['attendance', tenantId, 'timesheets'] as const,
  list: (
    tenantId: string,
    startDate: string | undefined,
    endDate: string | undefined,
    userId: string | undefined,
    offset: number,
  ) => [...attendanceKeys.lists(tenantId), { startDate, endDate, userId, offset }] as const,
  days: (tenantId: string, userId: string, startDate: string, endDate: string) =>
    ['attendance', tenantId, 'days', userId, startDate, endDate] as const,
}

export function useMyAttendanceQuery(tenantId: string) {
  return useQuery({
    queryKey: attendanceKeys.mine(tenantId),
    queryFn: async () =>
      (await graphqlClient.request(MyAttendanceDocument, undefined, { tenantId })).myAttendance,
    enabled: Boolean(tenantId),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useCheckInAttendanceMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () =>
      (
        await graphqlClient.request(
          CheckInAttendanceDocument,
          { input: { idempotencyKey: crypto.randomUUID() } },
          { tenantId },
        )
      ).checkInAttendance,
    onSuccess: async (status) => {
      queryClient.setQueryData(attendanceKeys.mine(tenantId), status)
      await queryClient.invalidateQueries({ queryKey: attendanceKeys.lists(tenantId) })
    },
  })
}

export function useCheckOutAttendanceMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (sessionId: string) =>
      (
        await graphqlClient.request(
          CheckOutAttendanceDocument,
          { input: { sessionId } },
          { tenantId },
        )
      ).checkOutAttendance,
    onSuccess: async (status) => {
      queryClient.setQueryData(attendanceKeys.mine(tenantId), status)
      await queryClient.invalidateQueries({ queryKey: attendanceKeys.lists(tenantId) })
    },
  })
}

export function useTimesheetsQuery(
  tenantId: string,
  startDate: string | undefined,
  endDate: string | undefined,
  userId: string | undefined,
  offset: number,
) {
  return useQuery({
    queryKey: attendanceKeys.list(tenantId, startDate, endDate, userId, offset),
    queryFn: async () =>
      (
        await graphqlClient.request(
          TimesheetsDocument,
          { filter: { startDate, endDate, userId, offset, limit: 20 } },
          { tenantId },
        )
      ).timesheets,
    enabled: Boolean(tenantId),
  })
}

export function useTimesheetDaysQuery(
  tenantId: string,
  userId: string | undefined,
  startDate: string,
  endDate: string,
) {
  return useQuery({
    queryKey: attendanceKeys.days(tenantId, userId ?? '', startDate, endDate),
    queryFn: async () =>
      (
        await graphqlClient.request(
          TimesheetDaysDocument,
          { filter: { userId: userId!, startDate, endDate } },
          { tenantId },
        )
      ).timesheetDays,
    enabled: Boolean(tenantId && userId && startDate && endDate),
  })
}

export function useSetTimesheetDayOverrideMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: SetTimesheetDayOverrideInput) =>
      (
        await graphqlClient.request(SetTimesheetDayOverrideDocument, { input }, { tenantId })
      ).setTimesheetDayOverride,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: attendanceKeys.all(tenantId) })
    },
  })
}
