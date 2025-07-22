import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, type SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { TextField, Select } from '~/components/form';
import { CustomModal } from '~/components/ui';
import { CreateUserSchema, type CreateUserInput } from '~/schema/createUserSchema';
import { UserRoleEnum, type UserRole } from '~/services/user/user.types';
import { toTitleCase } from '~/utils/textUtils';

const roleOptions = Object.values(UserRoleEnum).map((value) => {
  return {
    label: toTitleCase(value),
    value: value,
  };
});

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserCreateModal = ({ open, setOpen }: Props) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRoleEnum.USER);

  const handleSelectRole = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as UserRole);
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit = handleSubmit((data: CreateUserInput) => {
    console.log('Create User: ', data);
    setOpen(false);
    reset();
  });

  return (
    <CustomModal
      disabled={!isValid}
      title="Create User"
      open={open}
      onClose={() => setOpen(false)}
      maxWidth={520}
      onSubmit={onSubmit}
    >
      <Stack spacing={2} justifyContent="start" alignItems="start">
        <TextField required register={register} name="name" label="Name" placeholder="John Doe" />
        <TextField
          required
          register={register}
          name="username"
          label="Username"
          placeholder="johndoe123"
        />

        <Select
          required
          register={register}
          name="role"
          label="Role"
          onChange={handleSelectRole}
          selected={selectedRole}
          options={roleOptions}
        />
      </Stack>
    </CustomModal>
  );
};
