import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CreateReportDocument,
  DeleteReportDocument,
  FinancialSummaryDocument,
  ReportCreationContextDocument,
  ReportDocument,
  ReportsDocument,
  SaveReportDraftDocument,
  SubmitReportDocument,
  UpdateReportRemarksDocument,
  type DeleteReportInput,
  type FinancialSummaryInput,
  type ReportFieldsFragment,
  type ReportDetailFieldsFragment,
  type ReportsInput,
  type ReportTransitionInput,
  type SaveReportDraftInput,
  type UpdateReportRemarksInput,
} from '~/generated/graphql'
import { graphqlClient } from '~/lib/graphql'
import { inventoryKeys } from '../inventory/inventory.queries'

export type ReportRecord = ReportFieldsFragment
export type ReportDetailRecord = ReportDetailFieldsFragment

export const reportKeys = {
  all: (tenantId: string) => ['reports', tenantId] as const,
  context: (tenantId: string) => ['reports', tenantId, 'creation-context'] as const,
  lists: (tenantId: string) => ['reports', tenantId, 'list'] as const,
  list: (tenantId: string, input: ReportsInput) =>
    [...reportKeys.lists(tenantId), input] as const,
  detail: (tenantId: string, reportId: string) => ['reports', tenantId, reportId] as const,
  financialSummary: (tenantId: string, input: FinancialSummaryInput) =>
    [...reportKeys.all(tenantId), 'financial-summary', input] as const,
}

export function useReportCreationContextQuery(tenantId: string) {
  return useQuery({
    queryKey: reportKeys.context(tenantId),
    queryFn: async () =>
      (await graphqlClient.request(ReportCreationContextDocument, undefined, { tenantId }))
        .reportCreationContext,
  })
}

export function useReportsQuery(tenantId: string, input: ReportsInput = {}) {
  return useQuery({
    queryKey: reportKeys.list(tenantId, input),
    queryFn: async () =>
      (await graphqlClient.request(ReportsDocument, { input }, { tenantId }))
        .reports,
  })
}

export function useFinancialSummaryQuery(tenantId: string, input: FinancialSummaryInput) {
  return useQuery({
    queryKey: reportKeys.financialSummary(tenantId, input),
    queryFn: async () =>
      (await graphqlClient.request(FinancialSummaryDocument, { input }, { tenantId }))
        .financialSummary,
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
    mutationFn: async (input: { slotId: string; businessDate: string }) =>
      (await graphqlClient.request(CreateReportDocument, { input }, { tenantId })).createReport,
    onSuccess: async ({ report }) => {
      queryClient.setQueryData(reportKeys.detail(tenantId, report.id), report)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: reportKeys.context(tenantId) }),
        queryClient.invalidateQueries({ queryKey: reportKeys.lists(tenantId) }),
      ])
    },
  })
}

export function useSubmitReportMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: ReportTransitionInput) =>
      (await graphqlClient.request(SubmitReportDocument, { input }, { tenantId })).submitReport,
    onSuccess: async (report) => {
      queryClient.setQueryData(reportKeys.detail(tenantId, report.id), report)
      await queryClient.invalidateQueries({ queryKey: reportKeys.all(tenantId) })
      await queryClient.invalidateQueries({ queryKey: inventoryKeys.all(tenantId) })
    },
  })
}

export function useSaveReportDraftMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: SaveReportDraftInput) =>
      (await graphqlClient.request(SaveReportDraftDocument, { input }, { tenantId })).saveReportDraft,
    onSuccess: async (report) => {
      queryClient.setQueryData(reportKeys.detail(tenantId, report.id), report)
      await queryClient.invalidateQueries({ queryKey: reportKeys.lists(tenantId) })
    },
  })
}

export function useUpdateReportRemarksMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateReportRemarksInput) =>
      (await graphqlClient.request(UpdateReportRemarksDocument, { input }, { tenantId })).updateReportRemarks,
    onSuccess: async (report) => {
      queryClient.setQueryData(reportKeys.detail(tenantId, report.id), report)
      await queryClient.invalidateQueries({ queryKey: reportKeys.lists(tenantId) })
    },
  })
}

export function useDeleteReportMutation(tenantId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: DeleteReportInput) =>
      (await graphqlClient.request(DeleteReportDocument, { input }, { tenantId })).deleteReport,
    onSuccess: async (report) => {
      queryClient.setQueryData(reportKeys.detail(tenantId, report.id), report)
      await queryClient.invalidateQueries({ queryKey: reportKeys.all(tenantId) })
      await queryClient.invalidateQueries({ queryKey: inventoryKeys.all(tenantId) })
    },
  })
}
