import { zodResolver } from '@hookform/resolvers/zod';
import { EditOutlined } from '@mui/icons-material';
import { alpha, Box, Container, Stack, Typography } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { FormRow, InputWithFormat, TextField, TimePicker } from '~/components/form';
import { Button, BackButton, Form, PageLayout } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { useGetUserQuery, useUpdateUserMutation } from '~/services/user/user.queries';
import { UserRoleEnum } from '~/services/user/user.types';
import { UpdateUserSchema, type UpdateUserPayload } from '~/schema/updateUserSchema';
import theme from '~/theme';
import { pathFor } from '~/utils/pathFor';
import { parseBackendError } from '~/utils/parseBackendError';

export const UserDetailPage = () => {
  const { userId } = useParams();
  const { tenantId } = useTenantContext();

  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const initialValues = {
    name: '',
    address: null,
    contact: null,
    pagibig: null,
    philhealth: null,
    sss: null,
    tin: null,
    shiftStart: null,
    shiftEnd: null,
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<UpdateUserPayload>({
    defaultValues: initialValues,
    resolver: zodResolver(UpdateUserSchema),
    mode: 'onBlur',
  });

  const { name, address } = useWatch({ control });

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery({
    tenantId,
    userId,
  });

  const { mutateAsync: updateUser, isPending: isUpdatePending } = useUpdateUserMutation();

  useEffect(() => {
    if (isLoadingUser) return;

    reset({
      name: user?.name ?? '',
      address: user?.address ?? null,
      contact: user?.contact ?? null,
      pagibig: user?.pagibig ?? null,
      philhealth: user?.philhealth ?? null,
      sss: user?.sss ?? null,
      tin: user?.tin ?? null,
      shiftStart: user?.shiftSchedule?.shiftStart
        ? new Date(user.shiftSchedule.shiftStart)
        : null,
      shiftEnd: user?.shiftSchedule?.shiftEnd ? new Date(user.shiftSchedule.shiftEnd) : null,
    });
  }, [isLoadingUser, user, reset]);

  const handleToggleMode = () => (mode === 'view' ? setMode('edit') : setMode('view'));

  const onSubmit = async (data: UpdateUserPayload) => {
    if (!tenantId || !userId) return;
    try {
      const payload = {
        ...data,
        shiftStart: data.shiftStart ? data.shiftStart.toISOString() : null,
        shiftEnd: data.shiftEnd ? data.shiftEnd.toISOString() : null,
      };

      await updateUser({ data: payload as UpdateUserPayload, tenantId, userId });

      setMode('view');
      toast.success('User updated successfully');
    } catch (err) {
      const parsedError = parseBackendError(err);
      toast.error(`Failed to update user: ${parsedError}`);
    }
  };

  return (
    <PageLayout p={3}>
      <Container maxWidth="md" disableGutters>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Stack spacing={2} justifyContent="start" alignItems="start">
              <BackButton
                text="Back to Users"
                to={pathFor({
                  pathname: AdminRoutes.TenantUsers,
                  params: {
                    tenantId,
                  },
                })}
              />
              <Stack
                width="100%"
                px={4}
                py={2}
                border={1}
                borderColor="divider"
                borderRadius={1}
                spacing={1}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  spacing={4}
                >
                  <Stack>
                    <Typography variant="h6" fontWeight="bold">
                      General
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Basic information about the user. This helps identify the individual and keep
                      their profile up to date.
                    </Typography>
                  </Stack>
                  {mode === 'view' && (
                    <Button
                      onClick={handleToggleMode}
                      variant="contained"
                      startIcon={<EditOutlined fontSize="small" />}
                    >
                      Edit
                    </Button>
                  )}
                </Stack>
                <Stack width="100%" spacing={1}>
                  <FormRow label="Full Name">
                    <TextField
                      register={register}
                      mode={mode}
                      value={name}
                      name="name"
                      placeholder="Juan Dela Cruz"
                    />
                  </FormRow>
                  <FormRow label="Contact Number">
                    <InputWithFormat
                      mode={mode}
                      control={control}
                      name="contact"
                      pattern="9999-999-9999"
                      placeholder="0912-345-6789"
                    />
                  </FormRow>
                  <FormRow label="Address">
                    <TextField
                      register={register}
                      mode={mode}
                      value={address}
                      name="address"
                      placeholder="123 Main Street..."
                    />
                  </FormRow>
                </Stack>
              </Stack>
            </Stack>

            <Stack
              width="100%"
              px={4}
              py={2}
              border={1}
              borderColor="divider"
              borderRadius={1}
              spacing={1}
            >
              <Stack>
                <Typography variant="h6" fontWeight="bold">
                  Government IDs
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Government-issued identification numbers linked to the user for verification and
                  record-keeping.
                </Typography>
              </Stack>
              <Stack width="100%" spacing={1}>
                <FormRow label="TIN">
                  <InputWithFormat
                    mode={mode}
                    control={control}
                    name="tin"
                    pattern="999-999-999-999"
                    placeholder="123-456-789-101"
                  />
                </FormRow>
                <FormRow label="SSS">
                  <InputWithFormat
                    mode={mode}
                    control={control}
                    name="sss"
                    pattern="99-9999999-9"
                    placeholder="12-3456789-0"
                  />
                </FormRow>
                <FormRow label="PAG-IBIG">
                  <InputWithFormat
                    mode={mode}
                    control={control}
                    name="pagibig"
                    pattern="99-9999999999-9"
                    placeholder="12-3456789012-3"
                  />
                </FormRow>
                <FormRow label="PhilHealth">
                  <InputWithFormat
                    mode={mode}
                    control={control}
                    name="philhealth"
                    pattern="9999-9999-9999"
                    placeholder="1234-5678-9012"
                  />
                </FormRow>
              </Stack>
            </Stack>

            {user?.role === UserRoleEnum.USER && (
              <Stack
                width="100%"
                px={4}
                py={2}
                border={1}
                borderColor="divider"
                borderRadius={1}
                spacing={1}
              >
                <Stack>
                  <Typography variant="h6" fontWeight="bold">
                    Shift Schedule
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Define work shift hours for this user. Hours outside shift times will not be
                    credited.
                  </Typography>
                </Stack>
                <Stack width="100%" spacing={1}>
                  <FormRow label="Shift Start">
                    <TimePicker
                      control={control}
                      name="shiftStart"
                      label="Shift Start"
                      mode={mode}
                    />
                  </FormRow>
                  <FormRow label="Shift End">
                    <TimePicker control={control} name="shiftEnd" label="Shift End" mode={mode} />
                  </FormRow>
                </Stack>
              </Stack>
            )}

            {(errors.name ||
              errors.address ||
              errors.contact ||
              errors.tin ||
              errors.sss ||
              errors.pagibig ||
              errors.philhealth ||
              errors.birthday ||
              errors.shiftStart ||
              errors.shiftEnd) && (
              <Box
                sx={{
                  border: '1px solid',
                  px: 1,
                  py: 0.5,
                  bgcolor: alpha(theme.palette.error.main, 0.2),
                  borderColor: 'error.light',
                }}
              >
                <Typography fontSize="small" color="error">
                  {errors.name?.message ||
                    errors.address?.message ||
                    errors.contact?.message ||
                    errors.tin?.message ||
                    errors.sss?.message ||
                    errors.pagibig?.message ||
                    errors.philhealth?.message ||
                    errors.birthday?.message ||
                    errors.shiftStart?.message ||
                    errors.shiftEnd?.message}
                </Typography>
              </Box>
            )}
          </Stack>

          {mode === 'edit' && (
            <Stack justifyContent="start" direction="row" spacing={1} my={5}>
              <Button
                disabled={!isValid}
                loading={isUpdatePending}
                variant="contained"
                type="submit"
              >
                Update User
              </Button>
              <Button variant="outlined" onClick={handleToggleMode}>
                Cancel
              </Button>
            </Stack>
          )}
        </Form>
      </Container>
    </PageLayout>
  );
};
