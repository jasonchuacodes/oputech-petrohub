import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Dayjs } from 'dayjs';

import {
  cancelPayrollRun,
  generatePayslip,
  getPayrollRunById,
  getPayrollRuns,
  getPayslips,
  getUnprocessedTimesheets,
  markPayslipAsPaid,
  runPayroll,
} from './payroll.api';
import type {
  GeneratePayslipInput,
  GetPayslipsParams,
  RunPayrollInput,
} from './payroll.types';

export const payrollKeys = {
  all: ['payroll'] as const,
  payslips: (params: GetPayslipsParams) => [...payrollKeys.all, 'payslips', params] as const,
  runs: (tenantId: string, periodStart?: Dayjs, periodEnd?: Dayjs) =>
    [
      ...payrollKeys.all,
      'runs',
      tenantId,
      periodStart?.toISOString(),
      periodEnd?.toISOString(),
    ] as const,
  runDetail: (payrollRunId: string | undefined) =>
    [...payrollKeys.all, 'run', payrollRunId] as const,
  unprocessedTimesheets: (
    userId: string,
    tenantId: string,
    startDate?: string,
    endDate?: string
  ) =>
    [
      ...payrollKeys.all,
      'unprocessed-timesheets',
      userId,
      tenantId,
      startDate,
      endDate,
    ] as const,
};

export const useGetUnprocessedTimesheetsQuery = (
  userId: string | undefined,
  tenantId: string | undefined,
  startDate?: string,
  endDate?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: payrollKeys.unprocessedTimesheets(
      userId || '',
      tenantId || '',
      startDate,
      endDate
    ),
    queryFn: () => getUnprocessedTimesheets(userId!, tenantId!, startDate, endDate),
    enabled: !!userId && !!tenantId && enabled,
  });
};

export const useGeneratePayslipMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GeneratePayslipInput) => generatePayslip(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: ['timesheets'],
      });
    },
  });
};

export const useRunPayrollMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RunPayrollInput) => runPayroll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: ['timesheets'],
      });
    },
  });
};

export const useGetPayrollRunsQuery = (params: {
  tenantId: string;
  periodStart?: Dayjs;
  periodEnd?: Dayjs;
}) => {
  return useQuery({
    queryKey: payrollKeys.runs(params.tenantId, params.periodStart, params.periodEnd),
    queryFn: () =>
      getPayrollRuns({
        tenantId: params.tenantId,
        periodStart: params.periodStart?.toISOString(),
        periodEnd: params.periodEnd?.toISOString(),
      }),
  });
};

export const useGetPayrollRunByIdQuery = (payrollRunId: string | undefined) => {
  return useQuery({
    queryKey: payrollKeys.runDetail(payrollRunId),
    queryFn: () => getPayrollRunById(payrollRunId!),
    enabled: !!payrollRunId,
  });
};

export const useMarkPayslipAsPaidMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markPayslipAsPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });
    },
  });
};

export const useCancelPayrollRunMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelPayrollRun,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });
    },
  });
};

export const useGetPayslipsQuery = (params: GetPayslipsParams) => {
  return useQuery({
    queryKey: payrollKeys.payslips(params),
    queryFn: () => getPayslips(params),
  });
};
