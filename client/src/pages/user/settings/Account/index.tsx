import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Divider, Stack, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { InputWithFormat, Input, FormDatePicker } from '~/components/form';
import { Button, Form } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { UpdateUserSchema, type UpdateUserPayload } from '~/schema/updateUserSchema';
import { useGetUserQuery, useUpdateUserMutation } from '~/services/user/user.queries';
import { parseBackendError } from '~/utils/parseBackendError';

const initialValues = {
  name: '',
  address: null,
  email: null,
  contact: null,
  birthday: null,
  pagibig: null,
  philhealth: null,
  sss: null,
  tin: null,
};

export const AccountSettings = () => {
  const { auth } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userId = auth?.id;
  const tenantId = auth?.tenantId;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<UpdateUserPayload>({
    defaultValues: initialValues,
    resolver: zodResolver(UpdateUserSchema),
    mode: 'onBlur',
  });

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery({
    tenantId,
    userId,
  });

  const { mutateAsync: updateUser, isPending: isUpdatePending } = useUpdateUserMutation();

  useEffect(() => {
    if (isLoadingUser) return;

    reset({
      name: user?.name ?? '',
      email: user?.email ?? null,
      address: user?.address ?? null,
      contact: user?.contact ?? null,
      birthday: user?.birthday ? new Date(user.birthday) : null,
      pagibig: user?.pagibig ?? null,
      philhealth: user?.philhealth ?? null,
      sss: user?.sss ?? null,
      tin: user?.tin ?? null,
    });
  }, [isLoadingUser, user, reset]);

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  const onSubmit = async (data: UpdateUserPayload) => {
    if (!tenantId || !userId) return;

    try {
      await updateUser({ data, tenantId, userId });

      queryClient.invalidateQueries({
        queryKey: ['auth'],
      });

      toast.success('User updated successfully');
    } catch (err) {
      const parsedError = parseBackendError(err);
      toast.error(`Failed to update user: ${parsedError}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Stack justifyContent="center" alignItems="center" spacing={2} pb={2}>
        <Stack width="100%" spacing={0.5}>
          <Typography fontWeight="bold" color="text.secondary">
            Personal Information:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your basic account information here.
          </Typography>
        </Stack>

        {/* TODO: avatar uploader */}
        <Avatar alt="profile-picture" sx={{ width: 64, height: 64 }}>
          <Typography fontSize="inherit">U</Typography>
        </Avatar>

        <Stack width="100%" spacing={1}>
          <Input
            required
            control={control}
            name="name"
            label="Full name"
            placeholder="Enter first name"
          />
          <Input control={control} name="email" label="Email" placeholder="abc@gmail.com" />
          <Input
            control={control}
            name="address"
            label="Address"
            placeholder="123 Main Street, ABC City, ..."
          />
          <InputWithFormat
            control={control}
            name="contact"
            label="Contact"
            pattern="9999-999-9999"
            placeholder="0912-345-6789"
          />
          <FormDatePicker control={control} name="birthday" label="Birthday" disableFuture />
        </Stack>

        <Divider sx={{ width: '100%' }} />
        {/* Government */}
        <Stack width="100%" spacing={2}>
          <Stack spacing={0.5}>
            <Typography fontWeight="bold" color="text.secondary">
              Government Information:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Government-issued identification numbers linked to the user for verification and
              record-keeping.
            </Typography>
          </Stack>
          <InputWithFormat
            control={control}
            label="TIN"
            name="tin"
            pattern="999-999-999-999"
            placeholder="123-456-789-101"
          />
          <InputWithFormat
            control={control}
            label="SSS"
            name="sss"
            pattern="99-9999999-9"
            placeholder="12-3456789-0"
          />
          <InputWithFormat
            control={control}
            label="PAGIBIG"
            name="pagibig"
            pattern="99-9999999999-9"
            placeholder="12-3456789012-3"
          />
          <InputWithFormat
            control={control}
            label="PHILHEALTH"
            name="philhealth"
            pattern="9999-9999-9999"
            placeholder="1234-5678-9012"
          />
        </Stack>

        <Divider sx={{ width: '100%' }} />

        <Stack width="100%" direction="row" spacing={1}>
          <Button disableElevation={true} onClick={handleCancel} type="button" variant="outlined">
            Cancel
          </Button>
          <Button disabled={!isValid || isUpdatePending} type="submit" variant="contained">
            Update
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
};
