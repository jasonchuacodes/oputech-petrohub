import { useQuery } from '@tanstack/react-query';

import { getReportById, getReports } from './report.api';

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

export { useGetReportsQuery, useGetReportByIdQuery };
