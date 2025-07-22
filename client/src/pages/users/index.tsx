import { AddBoxOutlined } from '@mui/icons-material';
import { Container, Stack, Typography } from '@mui/material';

import { Button, PageLayout } from '~/components/ui';

import { SearchInput } from './SearchInput';
import { UsersTable } from './UsersTable';

export const UsersPage = () => {
  return (
    <PageLayout p={3}>
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={2}>
          <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
            <Stack spacing={0.5}>
              <Typography fontWeight="bold" variant="h5">
                Users
              </Typography>
              <Typography variant="body2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, voluptatibus.
              </Typography>
            </Stack>
            <Button startIcon={<AddBoxOutlined />} variant="contained">
              Create User
            </Button>
          </Stack>
          <SearchInput />

          <UsersTable />
        </Stack>
      </Container>
    </PageLayout>
  );
};
