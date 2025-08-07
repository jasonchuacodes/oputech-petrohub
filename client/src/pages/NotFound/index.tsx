import { Typography } from '@mui/material';

import { PageLayout } from '~/components/ui';

export const NotFoundPage = () => {
  return (
    <PageLayout justifyContent="center" alignItems="center" pt={10}>
      <Typography>
        Error 404. Page not found.
      </Typography>
    </PageLayout>
  );
};
