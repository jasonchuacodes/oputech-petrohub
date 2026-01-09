import { HomeOutlined } from '@mui/icons-material';

import { Breadcrumb, PageContainer, PageLayout } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { PageHeader } from '~/components/layouts';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

export const ReportDetailPage = () => {
  const { tenantId } = useTenantContext();

  return (
    <PageLayout>
      <PageContainer>
        <Breadcrumb
          items={[
            {
              icon: HomeOutlined,
              label: 'Home',
              to: pathFor({
                pathname: AdminRoutes.TenantHome,
                params: { tenantId },
              }),
            },
            {
              label: 'Reports',
              to: pathFor({
                pathname: AdminRoutes.TenantReports,
              })
            },
            {
              label: 'Report Details'
            }
          ]}
        />
        <PageHeader
          title="Report Details"
          description="View the detailed financial report of the shift here."
        />
      </PageContainer>
    </PageLayout>
  );
};
