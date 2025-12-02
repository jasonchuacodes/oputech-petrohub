import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Divider, Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { InputWithFormat, TextField } from '~/components/form';
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
};

export const AccountSettings = () => {
  const { auth } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userId = auth?.id;
  const tenantId = auth?.tenants[0].id;

  const {
    control,
    register,
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
          <Typography fontWeight="medium" color="text.secondary">
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
          <TextField
            required
            register={register}
            name="name"
            label="Full name"
            placeholder="Enter first name"
          />
          <TextField register={register} name="email" label="Email" placeholder="abc@gmail.com" />
          <TextField
            register={register}
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              control={control}
              name="birthday"
              render={({ field: { value, onChange } }) => (
                <Stack spacing={0.5}>
                  <Typography fontWeight="bold" color="text.secondary">
                    Birthday
                  </Typography>
                  <DatePicker
                    value={value ? dayjs(value) : null}
                    onChange={(date) => onChange(date ? date.toDate() : null)}
                    closeOnSelect
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { minWidth: 168 },
                      },
                      actionBar: { actions: ['clear'] },
                    }}
                    slots={{ toolbar: undefined }}
                  />
                </Stack>
              )}
            />
          </LocalizationProvider>
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
