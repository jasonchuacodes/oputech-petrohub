import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Divider, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { FormRow, Input, InputWithFormat, TimePicker } from '~/components/form';
import { Button, BackButton, Form, PageLayout } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { useGetUserQuery, useUpdateUserMutation } from '~/services/user/user.queries';
import { UserRole } from '~/services/user/user.types';
import { UpdateUserSchema, type UpdateUserPayload } from '~/schema/updateUserSchema';
import { pathFor } from '~/utils/pathFor';
import { parseBackendError } from '~/utils/parseBackendError';

import { ResetPasswordModal } from '../ResetPasswordModal';

export const UserDetailPage = () => {
  const { userId } = useParams();
  const { auth } = useAuthContext();
  const { tenantId } = useTenantContext();

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);

  const initialValues = {
    name: '',
    address: null,
    position: null,
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
      address: user?.address ?? null,
      position: user?.position ?? null,
      contact: user?.contact ?? null,
      pagibig: user?.pagibig ?? null,
      philhealth: user?.philhealth ?? null,
      sss: user?.sss ?? null,
      tin: user?.tin ?? null,
      shiftStart: user?.shiftSchedule?.shiftStart ? new Date(user.shiftSchedule.shiftStart) : null,
      shiftEnd: user?.shiftSchedule?.shiftEnd ? new Date(user.shiftSchedule.shiftEnd) : null,
    });
  }, [isLoadingUser, user, reset]);

  const onSubmit = async (data: UpdateUserPayload) => {
    if (!tenantId || !userId) return;
    try {
      const payload = {
        ...data,
        shiftStart: data.shiftStart ? data.shiftStart.toISOString() : null,
        shiftEnd: data.shiftEnd ? data.shiftEnd.toISOString() : null,
      };

      await updateUser({ data: payload as UpdateUserPayload, tenantId, userId });

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
                    <Typography variant="body1" fontWeight="medium">
                      General
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Basic information about the user. This helps identify the individual and keep
                      their profile up to date.
                    </Typography>
                  </Stack>
                </Stack>
                <Stack width="100%" spacing={1}>
                  <FormRow label="Full Name">
                    <Input
                      required
                      fullWidth
                      control={control}
                      name="name"
                      placeholder="John Doe"
                    />
                  </FormRow>
                  <FormRow label="Contact Number">
                    <InputWithFormat
                      control={control}
                      name="contact"
                      pattern="9999-999-9999"
                      placeholder="0000-000-0000"
                    />
                  </FormRow>
                  <FormRow label="Address">
                    <Input control={control} name="address" placeholder="Manila, Philippines" />
                  </FormRow>
                  <FormRow label="Position">
                    <Input control={control} name="position" placeholder="Operations Manager" />
                  </FormRow>
                </Stack>
              </Stack>
            </Stack>
            {user?.role === UserRole.USER && (
              <Stack
                width="100%"
                px={4}
                py={2}
                border={1}
                borderColor="divider"
                borderRadius={1}
                spacing={2}
              >
                <Stack>
                  <Typography variant="body1" fontWeight="medium">
                    Shift Schedule
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Define work shift hours for this user. Hours outside shift times will not be
                    credited.
                  </Typography>
                </Stack>
                <Stack alignItems="center" direction="row" width="100%" spacing={2}>
                  <TimePicker control={control} name="shiftStart" label="Shift Start" />
                  <Divider sx={{ width: 120 }} />
                  <TimePicker control={control} name="shiftEnd" label="Shift End" />
                </Stack>
              </Stack>
            )}
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
                <Typography variant="body1" fontWeight="medium">
                  Government IDs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Government-issued identification numbers linked to the user for verification and
                  record-keeping.
                </Typography>
              </Stack>
              <Stack width="100%" spacing={1}>
                <FormRow label="TIN">
                  <InputWithFormat
                    control={control}
                    name="tin"
                    pattern="999-999-999-999"
                    placeholder="000-000-000-000"
                  />
                </FormRow>
                <FormRow label="SSS">
                  <InputWithFormat
                    control={control}
                    name="sss"
                    pattern="99-9999999-9"
                    placeholder="00-0000000-0"
                  />
                </FormRow>
                <FormRow label="PAG-IBIG">
                  <InputWithFormat
                    control={control}
                    name="pagibig"
                    pattern="99-9999999999-9"
                    placeholder="00-0000000000-0"
                  />
                </FormRow>
                <FormRow label="PhilHealth">
                  <InputWithFormat
                    control={control}
                    name="philhealth"
                    pattern="9999-9999-9999"
                    placeholder="0000-0000-0000"
                  />
                </FormRow>
              </Stack>
            </Stack>

            {user?.role === UserRole.USER && (
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
                  <Typography variant="body1" fontWeight="medium">
                    Security
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage account security settings and password controls.
                  </Typography>
                </Stack>
                <Stack width="100%" spacing={2} pt={1}>
                  <Button
                    onClick={() => setIsResetPasswordModalOpen(true)}
                    disabled={auth?.id === userId}
                    color="error"
                    variant="outlined"
                    sx={{ width: 'fit-content' }}
                  >
                    Reset Password
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>

          <Stack justifyContent="start" direction="row" spacing={1} my={5}>
            <Button disabled={!isValid || !isDirty} loading={isUpdatePending} variant="contained" type="submit">
              Update User
            </Button>
          </Stack>
        </Form>
      </Container>

      <ResetPasswordModal
        open={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        userId={userId}
      />
    </PageLayout>
  );
};
