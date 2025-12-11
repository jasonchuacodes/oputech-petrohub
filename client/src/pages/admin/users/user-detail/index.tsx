import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import { Input, InputWithFormat, TimePicker } from '~/components/form';
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
import { AvatarPicker } from './AvatarPicker';

export const UserDetailPage = () => {
  const navigate = useNavigate();
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

      navigate(
        pathFor({
          pathname: AdminRoutes.TenantUsers,
          params: {
            tenantId,
          },
        }),
      );
    } catch (err) {
      const parsedError = parseBackendError(err);
      toast.error(`Failed to update user: ${parsedError}`);
    }
  };

  return (
    <PageLayout p={3}>
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={3}>
          <BackButton
            text="Back to Users"
            to={pathFor({
              pathname: AdminRoutes.TenantUsers,
              params: {
                tenantId,
              },
            })}
          />

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Grid container spacing={6}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight="medium">
                    Personal Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Basic information about the user
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={2}>
                    <AvatarPicker name={user?.name} />
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        Full Name
                      </Typography>
                      <Input
                        required
                        fullWidth
                        control={control}
                        name="name"
                        placeholder="John Doe"
                      />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        Contact Number
                      </Typography>
                      <InputWithFormat
                        control={control}
                        name="contact"
                        pattern="9999-999-9999"
                        placeholder="0000-000-0000"
                      />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        Address
                      </Typography>
                      <Input control={control} name="address" placeholder="Manila, Philippines" />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        Position
                      </Typography>
                      <Input control={control} name="position" placeholder="Operations Manager" />
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
              <Divider />

              {user?.role === UserRole.USER && (
                <>
                  <Grid container spacing={6}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Shift Schedule
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Define work shift hours for this user
                      </Typography>
                    </Grid>
                    <Grid sx={{ xs: 12, md: 8 }}>
                      <Stack spacing={1}>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight="medium">
                            Shift Start
                          </Typography>
                          <TimePicker control={control} name="shiftStart" label="" />
                        </Stack>
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight="medium">
                            Shift End
                          </Typography>
                          <TimePicker control={control} name="shiftEnd" label="" />
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              )}

              <Grid container spacing={6}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight="medium">
                    Government IDs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Government-issued information for reference
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={2}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        TIN
                      </Typography>
                      <InputWithFormat
                        control={control}
                        name="tin"
                        pattern="999-999-999-999"
                        placeholder="000-000-000-000"
                      />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        SSS
                      </Typography>
                      <InputWithFormat
                        control={control}
                        name="sss"
                        pattern="99-9999999-9"
                        placeholder="00-0000000-0"
                      />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        PAG-IBIG
                      </Typography>
                      <InputWithFormat
                        control={control}
                        name="pagibig"
                        pattern="99-9999999999-9"
                        placeholder="00-0000000000-0"
                      />
                    </Stack>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        PhilHealth
                      </Typography>
                      <InputWithFormat
                        control={control}
                        name="philhealth"
                        pattern="9999-9999-9999"
                        placeholder="0000-0000-0000"
                      />
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
              <Divider />

              <Grid container spacing={6}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" fontWeight="medium" color="error">
                    Danger Zone
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Manage account security settings and password controls
                    </Typography>
                    <Button
                      onClick={() => setIsResetPasswordModalOpen(true)}
                      disabled={auth?.id === userId}
                      color="error"
                      variant="outlined"
                      sx={{ width: 'fit-content' }}
                    >
                      Reset Password
                    </Button>

                    {auth?.id === userId && (
                      <Typography variant="caption" color="text.secondary">
                        You cannot reset your own password here. Please go to the{' '}
                        <Typography
                          variant="caption"
                          color="info"
                          sx={{ cursor: 'pointer' }}
                          onClick={() =>
                            navigate(
                              pathFor({
                                pathname: AdminRoutes.TenantAccountSettings,
                                params: { tenantId },
                              }),
                            )
                          }
                        >
                          account settings
                        </Typography>{' '}
                        section.
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
              <Divider />
            </Stack>

            <Stack py={2} width="100%">
              <Button
                disabled={!isValid || !isDirty}
                loading={isUpdatePending}
                variant="contained"
                type="submit"
                sx={{ alignSelf: 'end' }}
              >
                Save Changes
              </Button>
            </Stack>
          </Form>
        </Stack>
      </Container>

      <ResetPasswordModal
        open={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        userId={userId}
      />
    </PageLayout>
  );
};
