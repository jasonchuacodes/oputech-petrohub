import { CalendarMonth, Description } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { UserRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

import { PasswordChangeModal } from './PasswordChangeModal';
import { RecentLogs } from './RecentLogs';
import { ShortcutCard } from './ShortcutCard';
import { TimeLogger } from './TimeLogger';

export const HomePage = () => {
  const { auth } = useAuthContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (auth?.shouldChangePassword) {
      const skipped = sessionStorage.getItem('skipPasswordChange');

      if (!skipped) {
        setOpen(true);
      }
    }
  }, [auth?.shouldChangePassword]);

  const handleClose = () => {
    setOpen(false);
    sessionStorage.setItem('skipPasswordChange', 'true');
  };

  return (
    <PageLayout>
      <Stack spacing={2} p={2} flex={1}>
        <Stack spacing={1}>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {auth?.name?.split(' ')[0] || 'User'}!
          </Typography>
          <TimeLogger />
        </Stack>

        {/* Shortcut cards */}
        <Stack direction="row" spacing={1} width="100%">
          <ShortcutCard
            icon={CalendarMonth}
            title="Timesheets"
            to={pathFor({
              pathname: UserRoutes.Timesheets,
            })}
          />
          <ShortcutCard
            icon={Description}
            title="Report"
            to={pathFor({
              pathname: UserRoutes.Report,
            })}
          />
        </Stack>
        <RecentLogs />
      </Stack>

      <PasswordChangeModal open={open} onClose={handleClose} />
    </PageLayout>
  );
};
