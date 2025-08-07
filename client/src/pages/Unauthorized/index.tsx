import { Typography } from '@mui/material';

import { PageLayout } from '~/components/ui';

export const UnauthorizedPage = () => {
  return (
    <PageLayout justifyContent="center" alignItems="center" pt={10}>
      <Typography>
        You are unauthorized to access this page. Please contact the administrator or try logging in
        again.
      </Typography>
    </PageLayout>
  );
};
