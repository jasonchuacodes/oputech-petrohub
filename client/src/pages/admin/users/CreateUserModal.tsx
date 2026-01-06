import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, type SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Input, Select, PasswordField } from '~/components/form';
import { CustomModal } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { UserRole, type UserRole as UserRoleType } from '~/services/user/user.types';
import { CreateUserSchema, type CreateUserInput } from '~/schema/createUserSchema';
import { useCreateUserMutation } from '~/services/user/user.queries';
import { parseBackendError } from '~/utils/parseBackendError';
import { toTitleCase } from '~/utils/textUtils';
import { PeopleOutlined } from '@mui/icons-material';

const roleOptions = Object.values(UserRole).map((value) => {
  return {
    label: toTitleCase(value),
    value: value,
  };
});

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateUserModal = ({ open, setOpen }: Props) => {
  const { tenantId } = useTenantContext();

  const [selectedRole, setSelectedRole] = useState<UserRoleType>(UserRole.USER);

  const handleSelectRole = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as UserRoleType);
  };

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { isValid },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
  });

  const { mutate: createUser } = useCreateUserMutation({
    tenantId,
  });

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = handleSubmit((data: CreateUserInput) => {
    if (!tenantId) return;

    createUser(
      {
        ...data,
        tenantId,
      },
      {
        onSuccess: () => {
          toast.success('User created successfully!');

          setOpen(false);
          reset();
        },
        onError: (err) => {
          const parsedErr = parseBackendError(err);
          toast.error(`Failed to create user: ${parsedErr}`);
        },
      },
    );
  });

  return (
    <CustomModal
      disabled={!isValid}
      title="Create User"
      subheader="Add a new user to your company."
      open={open}
      onClose={handleCancel}
      onCancel={handleCancel}
      maxWidth={520}
      onSubmit={onSubmit}
      icon={PeopleOutlined}
    >
      <Stack spacing={2} justifyContent="start" alignItems="start">
        <Input
          required
          fullWidth
          control={control}
          name="name"
          label="Name"
          placeholder="John Doe"
        />
        <Input
          required
          fullWidth
          control={control}
          name="username"
          label="Username"
          placeholder="johndoe123"
        />
        <PasswordField
          required
          control={control}
          name="password"
          label="Password"
          placeholder="*******"
          copiable
          randomizer
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
