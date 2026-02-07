import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generatePayroll, getUnprocessedTimesheets } from './payroll.api';
import type {
  GeneratePayrollInput,
  GetPayrollRecordsParams,
} from './payroll.types';

export const payrollKeys = {
  all: ['payroll'] as const,
  records: (params: GetPayrollRecordsParams) =>
    [...payrollKeys.all, 'records', params] as const,
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

export const useGeneratePayrollMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GeneratePayrollInput) => generatePayroll(data),
    onSuccess: (_, variables) => {
      // Invalidate payroll records
      queryClient.invalidateQueries({
        queryKey: payrollKeys.all,
      });
      // Invalidate unprocessed timesheets
      queryClient.invalidateQueries({
        queryKey: payrollKeys.unprocessedTimesheets(
          variables.userId,
          variables.tenantId
        ),
      });
      // Invalidate timesheet queries to refresh processed status
      queryClient.invalidateQueries({
        queryKey: ['timesheets'],
      });
    },
  });
};
