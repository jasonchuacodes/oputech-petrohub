import { AddBoxOutlined } from '@mui/icons-material';
import { Container, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { SearchInput } from '~/components/form';
import { Button, PageLayout } from '~/components/ui';

import { UsersTable } from './UsersTable';
import { UserCreateModal } from './UserCreateModal';

export const UsersPage = () => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

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
            <Button
              onClick={() => setIsCreateUserModalOpen(true)}
              startIcon={<AddBoxOutlined />}
              variant="contained"
            >
              Create User
            </Button>
          </Stack>
          <SearchInput />

          <UsersTable />
        </Stack>
      </Container>
      
      {/* Create User modal */}
      <UserCreateModal open={isCreateUserModalOpen} setOpen={setIsCreateUserModalOpen} />
    </PageLayout>
  );
};
