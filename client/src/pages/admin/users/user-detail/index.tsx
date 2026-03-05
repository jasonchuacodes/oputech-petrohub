import { zodResolver } from '@hookform/resolvers/zod';
import { HomeOutlined } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { Button, Breadcrumb, Form, PageContainer, PageLayout, Show } from '~/components/ui';
import { PageHeader } from '~/components/layouts';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { useGetUserQuery, useUpdateUserMutation } from '~/services/user/user.queries';
import { UserRole } from '~/services/user/user.types';
import { useGetShiftsQuery } from '~/services/shift/shift.queries';
import { UpdateUserSchema, type UpdateUserPayload } from '~/schema/updateUserSchema';
import { pathFor } from '~/utils/pathFor';
import { parseBackendError } from '~/utils/parseBackendError';
import {
  useGetCurrentSalaryRateQuery,
  useCreateSalaryRateMutation,
} from '~/services/salary/salary.queries';
import { RateType } from '~/services/salary/salary.types';

import { BasicDetail } from './BasicDetail';
import { DeleteUser } from './DeleteUser';
import { GovernmentDetails } from './GovernmentDetails';
import { EmploymentDetail } from './EmploymentDetail';
import { ResetPassword } from './ResetPassword';

export const UserDetailPage = () => {
  const { userId } = useParams();

  const { tenantId } = useTenantContext();

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery({
    tenantId,
    userId,
  });

  const { data: shifts } = useGetShiftsQuery(tenantId);
  const { data: currentSalaryRate } = useGetCurrentSalaryRateQuery(userId, tenantId);

  const { mutateAsync: updateUser, isPending: isUpdatePending } = useUpdateUserMutation();
  const { mutateAsync: createSalaryRate } = useCreateSalaryRateMutation();

  const initialValues: UpdateUserPayload = {
    name: '',
    birthday: null,
    address: null,
    position: null,
    hireDate: null,
    status: null,
    contact: null,
    pagibig: null,
    philhealth: null,
    sss: null,
    tin: null,
    shiftId: null,
    rate: null,
    rateType: null,
    effectiveFrom: null,
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm<UpdateUserPayload>({
    defaultValues: initialValues,
    resolver: zodResolver(UpdateUserSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (isLoadingUser) return;

    reset({
      name: user?.name ?? '',
      birthday: user?.birthday ? new Date(user.birthday) : null,
      address: user?.address ?? null,
      position: user?.position ?? null,
      hireDate: user?.hireDate ? new Date(user.hireDate) : null,
      status: user?.status ?? null,
      contact: user?.contact ?? null,
      pagibig: user?.pagibig ?? null,
      philhealth: user?.philhealth ?? null,
      sss: user?.sss ?? null,
      tin: user?.tin ?? null,
      shiftId: user?.shiftSchedule?.shiftId ?? null,
      rate: currentSalaryRate?.rate ?? null,
      rateType: currentSalaryRate?.rateType ?? RateType.HOURLY,
      effectiveFrom: null,
    });
  }, [isLoadingUser, user, currentSalaryRate, reset]);

  const onSubmit = async (data: UpdateUserPayload) => {
    if (!tenantId || !userId) return;

    try {
      const userPayload = {
        name: data.name,
        birthday: data.birthday || null,
        address: data.address,
        position: data.position,
        hireDate: data.hireDate || null,
        status: data.status,
        contact: data.contact,
        pagibig: data.pagibig,
        philhealth: data.philhealth,
        sss: data.sss,
        tin: data.tin,
        shiftId: data.shiftId || null,
      };

      await updateUser({ data: userPayload, tenantId, userId });

      if (
        data.rate !== null &&
        data.rate !== undefined &&
        data.rateType &&
        (data.rate !== currentSalaryRate?.rate || data.rateType !== currentSalaryRate?.rateType)
      ) {
        await createSalaryRate({
          userId,
          tenantId,
          rate: data.rate,
          rateType: data.rateType,
          effectiveFrom: data.effectiveFrom || undefined,
        });
      }

      reset(data);
      toast.success('User updated successfully');
    } catch (err) {
      const parsedError = parseBackendError(err);
      toast.error(`Failed to update user: ${parsedError}`);
    }
  };

  const isEmployee = user?.role === UserRole.USER;

  return (
    <PageLayout>
      <Form onSubmit={handleSubmit(onSubmit)} sx={{ height: '100%' }}>
        <PageContainer spacing={3}>
          <Breadcrumb
            items={[
              {
                icon: HomeOutlined,
                label: 'Home',
                to: pathFor({
                  pathname: AdminRoutes.TenantHome,
                  params: { tenantId },
                }),
              },
              {
                label: 'Users',
                to: pathFor({
                  pathname: AdminRoutes.TenantUsers,
                  params: { tenantId },
                }),
              },
              {
                label: user?.name ?? 'Loading...',
              },
            ]}
          />
          <PageHeader title="User Profile" description="View and manage the user details here. " />

          <BasicDetail control={control} user={user} />
          <Show when={isEmployee}>
            <EmploymentDetail control={control} shifts={shifts || []} user={user} />
          </Show>
          <GovernmentDetails control={control} />
          <ResetPassword />
          <DeleteUser user={user} />
        </PageContainer>

        <Stack
          py={2}
          px={3}
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
    </PageLayout>
  );
};
