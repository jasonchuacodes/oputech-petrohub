import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateReportDocument,
  DeleteReportDocument,
  ReportCreationContextDocument,
  ReportDocument,
  ReportsDocument,
  SubmitReportDocument,
  type ReportFieldsFragment,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'

export type ReportRecord = ReportFieldsFragment

export const reportKeys = {
  all: (tenantId: string) => ['reports', tenantId] as const,
  context: (tenantId: string) => ['reports', tenantId, 'creation-context'] as const,
  list: (tenantId: string) => ['reports', tenantId, 'list'] as const,
  detail: (tenantId: string, reportId: string) => ['reports', tenantId, reportId] as const,
}

export function useReportCreationContextQuery(tenantId: string) {
  return useQuery({
    queryKey: reportKeys.context(tenantId),
    queryFn: async () =>
      (await graphqlClient.request(ReportCreationContextDocument, undefined, { tenantId }))
        .reportCreationContext,
  })
}

export function useReportsQuery(tenantId: string) {
  return useQuery({
    queryKey: reportKeys.list(tenantId),
    queryFn: async () =>
      (await graphqlClient.request(ReportsDocument, { input: { offset: 0, limit: 100 } }, { tenantId }))
        .reports,
  })
}

export function useReportQuery(tenantId: string, reportId: string) {
  return useQuery({
    queryKey: reportKeys.detail(tenantId, reportId),
    queryFn: async () =>
      (await graphqlClient.request(ReportDocument, { input: { reportId } }, { tenantId })).report,
  })
}

export function useCreateReportMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { shiftId: string; businessDate: string }) =>
      (await graphqlClient.request(CreateReportDocument, { input }, { tenantId })).createReport,
    onSuccess: async ({ report }) => {
      queryClient.setQueryData(reportKeys.detail(tenantId, report.id), report)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reportKeys.context(tenantId) }),
        queryClient.invalidateQueries({ queryKey: reportKeys.list(tenantId) }),
      ])
    },
  })
}

export function useSubmitReportMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { reportId: string; expectedRevision: number }) =>
      (await graphqlClient.request(SubmitReportDocument, { input }, { tenantId })).submitReport,
    onSuccess: async (report) => {
      queryClient.setQueryData(reportKeys.detail(tenantId, report.id), report)
      await queryClient.invalidateQueries({ queryKey: reportKeys.all(tenantId) })
    },
  })
}

export function useDeleteReportMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { reportId: string; expectedRevision: number }) =>
      (await graphqlClient.request(DeleteReportDocument, { input }, { tenantId })).deleteReport,
    onSuccess: async (_, input) => {
      queryClient.removeQueries({ queryKey: reportKeys.detail(tenantId, input.reportId) })
      await queryClient.invalidateQueries({ queryKey: reportKeys.all(tenantId) })
    },
  })
}
