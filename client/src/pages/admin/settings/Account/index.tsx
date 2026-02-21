import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Container, Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { InputWithFormat, Input } from '~/components/form';
import { Button, DatePicker, Form } from '~/components/ui';
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
};

export const AccountSettings = () => {
  const { auth } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userId = auth?.id;
  const tenantId = auth?.tenants[0].id;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
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
    <Form onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <Container maxWidth="sm" disableGutters sx={{ flex: 1, overflow: 'auto', margin: 0 }}>
        <Stack justifyContent="center" alignItems="start" spacing={2} p={3}>
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
            <InputWithFormat
              control={control}
              name="contact"
              label="Contact"
              pattern="9999-999-9999"
              placeholder="0912-345-6789"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                control={control}
                name="birthday"
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Birthday"
                    value={value ? dayjs(value) : null}
                    onChange={(date) => onChange(date ? date.toDate() : null)}
                  />
                )}
              />
            </LocalizationProvider>
            <Input
              control={control}
              name="address"
              label="Address"
              placeholder="123 Main Street, ABC City, ..."
            />
          </Stack>
        </Stack>
      </Container>

      <Stack
        px={3}
        py={2}
        width="100%"
        bgcolor="background.paper"
        direction="row"
        spacing={1}
        justifyContent="end"
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button
          disabled={!isValid || !isDirty || isUpdatePending}
          type="submit"
          variant="contained"
        >
          Save Changes
        </Button>
      </Stack>
    </Form>
  );
};
