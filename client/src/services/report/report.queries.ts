import { useQuery } from '@tanstack/react-query';

import { getReports } from './report.api';

const useGetReportsQuery = ({ tenantId }: { tenantId?: string }) => {
  return useQuery({
    queryKey: ['reports', tenantId],
    queryFn: () => getReports(tenantId!),
    enabled: !!tenantId,
  });
};

export { useGetReportsQuery };
