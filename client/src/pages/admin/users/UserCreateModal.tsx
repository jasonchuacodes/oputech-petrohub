import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, type SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { TextField, Select } from '~/components/form';
import { CustomModal } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { UserRoleEnum, type UserRole } from '~/services/user/user.types';
import { CreateUserSchema, type CreateUserInput } from '~/schema/createUserSchema';
import { useCreateUserMutation } from '~/services/user/user.queries';
import { parseBackendError } from '~/utils/parseBackendError';
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
  const { tenantId } = useTenantContext();

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
      open={open}
      onClose={handleCancel}
      onCancel={handleCancel}
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
        <TextField
          register={register}
          name="position"
          label="Position"
          placeholder="Manager"
        />

      </Stack>
    </CustomModal>
  );
};
