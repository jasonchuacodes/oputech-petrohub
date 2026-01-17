import { CalendarMonth, Description } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { UserRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';

import { PasswordChangeModal } from './PasswordChangeModal';
import { TimeLogger } from './TimeLogger';
import { TimesheetsSection } from './TimesheetsSection';
import { ShortcutCard } from './ShortcutCard';

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
      <Stack spacing={1} p={2} bgcolor="background.paper" flex={1}>
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
        <TimesheetsSection />
      </Stack>

      <PasswordChangeModal open={open} onClose={handleClose} />
    </PageLayout>
  );
};
