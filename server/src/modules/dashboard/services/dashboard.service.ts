import { getLatestTimesheets } from '~/modules/timesheet/services/timesheet.service';

import { getUsersByTenantId } from '../../user/services/user.service';

const getDashboardData = async ({ tenantId }: { tenantId: string }) => {
  const [latestTimesheets, latestUsers] = await Promise.all([
    getLatestTimesheets(tenantId),
    getUsersByTenantId(tenantId),
  ]);

  return {
    latestTimesheets,
    latestUsers,
  };
};

export { getDashboardData };
