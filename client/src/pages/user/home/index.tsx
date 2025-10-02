import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';

import { DateTimeDisplay } from './DateTimeDisplay';
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
    <PageLayout p={2} spacing={4}>
      <Stack spacing={1}>
        <DateTimeDisplay />
        <TimeLogger />
      </Stack>

      <TimesheetsSection />

      <PasswordChangeModal open={open} onClose={handleClose} />
    </PageLayout>
  );
};
