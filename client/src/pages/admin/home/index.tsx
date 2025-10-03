import { Container, Stack, Typography } from '@mui/material';

import { PageLayout } from '~/components/ui';

import { Widget } from './Widget';

export const HomePage = () => {
  return (
    <PageLayout p={3}>
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={2}>
          {/* Header */}
          <Stack spacing={3} alignItems="start">
            <Typography fontWeight="bold" variant="h5">
              Dashboard
            </Typography>
          </Stack>

          <Widget />
        </Stack>
      </Container>
    </PageLayout>
  );
};
