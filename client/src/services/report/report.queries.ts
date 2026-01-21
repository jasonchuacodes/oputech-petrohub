import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createReport, getReportById, getReportByShift, getReports, createIncome, deleteIncome, createExpense, deleteExpense, assignEmployee, removeEmployee, updateDisposal, validateReport, submitReport, createInventory, updateInventory, deleteInventory } from './report.api';

const useGetReportsQuery = ({ tenantId }: { tenantId?: string }) => {
  return useQuery({
    queryKey: ['reports', tenantId],
    queryFn: () => getReports(tenantId!),
    enabled: !!tenantId,
  });
};

const useGetReportByIdQuery = ({ tenantId, reportId }: { tenantId?: string; reportId: string }) => {
  return useQuery({
    queryKey: ['report', tenantId, reportId],
    queryFn: () => getReportById(tenantId!, reportId),
    enabled: !!tenantId && !!reportId,
  });
};

const useGetReportByShiftQuery = ({
  tenantId,
  shiftId,
  shiftDate,
}: {
  tenantId?: string;
  shiftId?: string;
  shiftDate?: string;
}) => {
  return useQuery({
    queryKey: ['report', 'by-shift', tenantId, shiftId, shiftDate],
    queryFn: () => getReportByShift(tenantId!, shiftId!, shiftDate!),
    enabled: !!tenantId && !!shiftId && !!shiftDate,
    retry: false
  });
};


const useCreateReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reports', data.tenantId] });
    },
  });
};

const useCreateIncomeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, data }: { reportId: string; data: { description: string; amount: number } }) =>
      createIncome(reportId, data),
    onSuccess: () => {
      // Note: We need tenantId to fully invalidate, but we can invalidate by reportId
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useDeleteIncomeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, incomeId }: { reportId: string; incomeId: string }) =>
      deleteIncome(reportId, incomeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, data }: { reportId: string; data: { description: string; amount: number } }) =>
      createExpense(reportId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useDeleteExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, expenseId }: { reportId: string; expenseId: string }) =>
      deleteExpense(reportId, expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useCreateInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, data }: { reportId: string; data: { productId: string; quantity: number } }) =>
      createInventory(reportId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useUpdateInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, productId, data }: { reportId: string; productId: string; data: { quantity: number } }) =>
      updateInventory(reportId, productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useDeleteInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, productId }: { reportId: string; productId: string }) =>
      deleteInventory(reportId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useAssignEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, userId }: { reportId: string; userId: string }) =>
      assignEmployee(reportId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useRemoveEmployeeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, userId }: { reportId: string; userId: string }) =>
      removeEmployee(reportId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useUpdateDisposalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, disposalId, data }: { reportId: string; disposalId: string; data: { afterReading: number } }) =>
      updateDisposal(reportId, disposalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useValidateReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) => validateReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

const useSubmitReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: string) => submitReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report'] });
    },
  });
};

export {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGetReportByShiftQuery,
  useCreateReportMutation,
  useCreateIncomeMutation,
  useDeleteIncomeMutation,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useCreateInventoryMutation,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
  useAssignEmployeeMutation,
  useRemoveEmployeeMutation,
  useUpdateDisposalMutation,
  useValidateReportMutation,
  useSubmitReportMutation,
};
