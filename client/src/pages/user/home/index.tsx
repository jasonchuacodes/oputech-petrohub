import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { DateTimeDisplay, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';

import { PasswordChangeModal } from './PasswordChangeModal';
import { TimeLogger } from './TimeLogger';
import { TimesheetsSection } from './TimesheetsSection';

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
      <Stack spacing={4} p={2} bgcolor="background.paper" flex={1}>
        <Stack spacing={1}>
          <DateTimeDisplay />
          <TimeLogger />
        </Stack>

        <TimesheetsSection />
      </Stack>

      <PasswordChangeModal open={open} onClose={handleClose} />
    </PageLayout>
  );
};
