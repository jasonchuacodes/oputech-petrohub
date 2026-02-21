import { CalendarMonth, Description, ReceiptLong } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { useEffect } from 'react';

import { PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { pathFor } from '~/utils/pathFor';
import { UserRoutes } from '~/routes';

import { PasswordChangeModal } from './PasswordChangeModal';
import { RecentLogs } from './RecentLogs';
import { ShortcutCard } from './ShortcutCard';
import { TimeLogger } from './TimeLogger';
import { ShiftSelectionModal } from './ShiftSelectionModal';

export const HomePage = () => {
  const { auth } = useAuthContext();

  const passwordModal = useDisclosure();
  const shiftSelectionDisclosure = useDisclosure();

  const [firstName, ...rest] = auth?.name.split(' ') ?? [];
  const lastName = rest.at(-1) ?? '';
  const displayName = `${firstName} ${lastName}`;

  useEffect(() => {
    if (auth?.shouldChangePassword) {
      const skipped = sessionStorage.getItem('skipPasswordChange');

      if (!skipped) {
        passwordModal.onOpen();
      }
    }
  }, [auth?.shouldChangePassword, passwordModal]);

  const handleClose = () => {
    passwordModal.onClose();
    sessionStorage.setItem('skipPasswordChange', 'true');
  };

  const handleReportCardClick = () => {
    shiftSelectionDisclosure.onOpen();
  };

  return (
    <PageLayout>
      <Stack spacing={2} p={2} flex={1}>
        <Stack spacing={1}>
          <Typography variant="h6">
            Welcome back,{' '}
            <Typography variant="inherit" component="span" color="warning.main" fontWeight={600}>
              {displayName || 'User'}
            </Typography>
          </Typography>
          <TimeLogger />
        </Stack>

        {/* Shortcut cards */}
        <Stack spacing={1} width="100%">
          <ShortcutCard icon={Description} title="Report" to="#" onClick={handleReportCardClick} />
          <Stack direction="row" spacing={1} width="100%">
            <ShortcutCard
              icon={CalendarMonth}
              title="Timesheets"
              to={pathFor({
                pathname: UserRoutes.Timesheets,
              })}
            />
            <ShortcutCard
              icon={ReceiptLong}
              title="Payslips"
              to={pathFor({
                pathname: UserRoutes.Payslips,
              })}
            />
          </Stack>
        </Stack>
        <RecentLogs />
      </Stack>

      <PasswordChangeModal open={passwordModal.open} onClose={handleClose} />

      <ShiftSelectionModal
        open={shiftSelectionDisclosure.open}
        onClose={shiftSelectionDisclosure.onClose}
        tenantId={auth?.tenantId}
      />
    </PageLayout>
  );
};
