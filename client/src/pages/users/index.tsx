import { AddBoxOutlined } from '@mui/icons-material';
import { Container, Stack, Typography, type SelectChangeEvent } from '@mui/material';
import { useState } from 'react';

import { TextField, SearchInput, Select } from '~/components/form';
import { Button, CustomModal, PageLayout } from '~/components/ui';
import { UserRoleEnum, type UserRole } from '~/services/user/user.types';
import { toTitleCase } from '~/utils/textUtils';

import { UsersTable } from './UsersTable';

const roleOptions = Object.values(UserRoleEnum).map((value) => {
  return {
    label: toTitleCase(value),
    value: value,
  };
});

export const UsersPage = () => {
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRoleEnum.USER);

  const handleSelectRole = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as UserRole);
  };

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
      <CustomModal
        title="Create User"
        open={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        maxWidth={520}
      >
        <Stack spacing={2} justifyContent="start" alignItems="start">
          <TextField required name="name" label="Name" placeholder="John Doe" />
          <TextField required name="username" label="Username" placeholder="johndoe123" />

          <Select
            required
            name="role"
            label="Role"
            onChange={handleSelectRole}
            selected={selectedRole}
            options={roleOptions}
          />
        </Stack>
      </CustomModal>
    </PageLayout>
  );
};
