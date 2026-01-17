import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createReport, getReportById, getReports } from './report.api';

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

const useCreateReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reports', data.tenantId] });
    },
  });
};

export { useGetReportsQuery, useGetReportByIdQuery, useCreateReportMutation };
