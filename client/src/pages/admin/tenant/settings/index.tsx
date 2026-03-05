import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Typography } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { InputWithFormat, Input } from '~/components/form';
import { Button, Form, PageContainer, PageLayout } from '~/components/ui';
import { PageHeader } from '~/components/layouts';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { UpdateTenantSchema, type UpdateTenantInput } from '~/schema/updateTenantSchema';
import { useUpdateTenantMutation } from '~/services/tenant/tenant.queries';
import type { Tenant } from '~/services/tenant/tenant.types';
import { parseBackendError } from '~/utils/parseBackendError';

const initialValues = {
  name: '',
  email: '',
  description: null,
  contact: '',
  address: null,
  tin: null,
  sss: null,
  pagibig: null,
  philhealth: null,
};

export const TenantSettingsPage = () => {
  const { tenant, setTenant, tenantId } = useTenantContext();

  const {
    control,
    formState: { isValid, isDirty },
    handleSubmit,
    reset,
  } = useForm<UpdateTenantInput>({
    defaultValues: initialValues,
    resolver: zodResolver(UpdateTenantSchema),
    mode: 'onTouched',
  });

  const { mutate: updateTenant, isPending: isUpdatePending } = useUpdateTenantMutation();

  useEffect(() => {
    if (tenant) {
      reset({
        name: tenant.name ?? '',
        email: tenant.email ?? '',
        contact: tenant.contact ?? '',
        address: tenant.address ?? '',
        description: tenant.description ?? '',
        sss: tenant.sss ?? null,
        tin: tenant.tin ?? null,
        philhealth: tenant.philhealth ?? null,
        pagibig: tenant.pagibig ?? null,
      });
    }
  }, [tenant, reset]);

  const onSubmit = async (data: UpdateTenantInput) => {
    if (!tenantId) return;

    updateTenant(
      {
        tenantId,
        ...data,
      },
      {
        onSuccess: (data: Tenant) => {
          toast.success('Successfully updated tenant.');

          setTenant(data);
          reset();
        },
        onError: (err) => {
          const errorMessage = parseBackendError(err);
          toast.error(`Failed to update tenant: ${errorMessage}`);
        },
      },
    );
  };

  return (
    <PageLayout>
      <Form onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', flex: 1 }}>
        <PageContainer spacing={3} sx={{ flex: 1 }}>
          <PageHeader
            title="Tenant Settings"
            description="Manage your organization's profile, contact information, and government registration details."
          />
          <Stack spacing={3}>
            {/* General Info */}
            <Stack spacing={1} bgcolor="background.paper" borderRadius={2} p={2}>
              <Typography variant="h6" fontWeight="medium">
                General
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Provide your company's basic details. This information helps identify and
                distinguish your organization within the platform.
              </Typography>
              <Input
                required
                fullWidth
                control={control}
                name="name"
                label="Name"
                placeholder="ABC Corporation"
              />
              <Input
                required
                fullWidth
                control={control}
                name="email"
                label="Email Address"
                placeholder="hello@abc.com"
              />
              <InputWithFormat
                required
                control={control}
                name="contact"
                label="Contact Number"
                pattern="9999-999-9999"
                placeholder="0925-123-1234"
              />
              <Input
                control={control}
                name="address"
                label="Address"
                placeholder="123 Main Street..."
              />
            </Stack>

            {/* Government Info */}
            <Stack spacing={1} bgcolor="background.paper" borderRadius={2} p={2}>
              <Typography variant="h6" fontWeight="medium">
                Government
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Government-issued information for compliance and reporting purposes
              </Typography>
              <InputWithFormat
                control={control}
                name="tin"
                label="TIN"
                pattern="999-999-999-999"
                placeholder="123-456-789-000"
              />
              <InputWithFormat
                control={control}
                name="sss"
                label="SSS"
                pattern="99-9999999-9"
                placeholder="12-3456789-0"
              />
              <InputWithFormat
                control={control}
                name="pagibig"
                label="PAGIBIG"
                pattern="99-9999999999"
                placeholder="12-3456789012"
              />
              <InputWithFormat
                control={control}
                name="philhealth"
                label="PhilHealth"
                pattern="9999-9999-9999"
                placeholder="1234-5678-9012"
              />
            </Stack>

            {/* Other Info */}
            <Stack spacing={1} bgcolor="background.paper" borderRadius={2} p={2}>
              <Typography variant="h6" fontWeight="medium">
                Additional Information
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Optional details about your organization
              </Typography>
              <Input
                multiline
                rows={3}
                control={control}
                name="description"
                label="Description"
                placeholder="Add a brief description"
              />
              <Stack alignItems="end" direction="row" spacing={1} width="100%">
                <Button
                  size="small"
                  startIcon={<AddOutlined fontSize="inherit" />}
                  variant="outlined"
                >
                  Upload Files
                </Button>
                <Typography variant="caption">{`(Max 5 files, up to 10MB)`}</Typography>
              </Stack>
            </Stack>
          </Stack>
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
          {isDirty && (
            <Button variant="outlined" onClick={() => reset()}>
              Cancel
            </Button>
          )}
          <Button
            disabled={!isValid || !isDirty || isUpdatePending}
            variant="contained"
            type="submit"
          >
            Save
          </Button>
        </Stack>
      </Form>
    </PageLayout>
  );
};
