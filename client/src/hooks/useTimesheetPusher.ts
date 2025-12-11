import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useTenantContext } from '~/context/tenant/useTenantContext';
import type { DailyTimesheetUser } from '~/services/timesheet/timesheet.types';

import { usePusher } from './usePusher';

export const useTimesheetPusher = () => {
  const { tenantId } = useTenantContext();
  const queryClient = useQueryClient();

  const handleTimesheetUpdated = useCallback(
    (data: { user: DailyTimesheetUser; action: 'CHECK_IN' | 'CHECK_OUT' }) => {
      // Optimistically update cache
      queryClient.setQueryData<DailyTimesheetUser[]>(
        ['daily-timesheets', tenantId],
        (old) => {
          if (!old) return old;

          // Find existing user index
          const userIndex = old.findIndex((u) => u.id === data.user.id);

          let updated: DailyTimesheetUser[];
          if (userIndex >= 0) {
            // Update existing user
            updated = [...old];
            updated[userIndex] = data.user;
          } else {
            // Add new user (edge case: user just joined tenant)
            updated = [...old, data.user];
          }

          // Re-sort: IN status first, then OUT
          return updated.sort((a, b) => {
            if (a.status === 'IN' && b.status === 'OUT') return -1;
            if (a.status === 'OUT' && b.status === 'IN') return 1;
            return 0;
          });
        },
      );
    },
    [queryClient, tenantId],
  );

  const { pusher } = usePusher({
    channelName: `private-tenant-${tenantId}`,
    eventName: 'timesheet-updated',
    onEvent: handleTimesheetUpdated,
    enabled: !!tenantId,
  });

  return { pusher };
};
