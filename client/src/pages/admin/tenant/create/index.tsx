import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Typography } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { InputWithFormat, Input } from '~/components/form';
import { Button, Form, PageContainer, PageLayout } from '~/components/ui';
import { PageHeader } from '~/components/layouts';
import { CreateTenantSchema, type CreateTenantInput } from '~/schema/createTenantSchema';
import { useCreateTenantMutation } from '~/services/tenant/tenant.queries';
import type { Tenant } from '~/services/tenant/tenant.types';
import { parseBackendError } from '~/utils/parseBackendError';
import { pathFor } from '~/utils/pathFor';
import { AdminRoutes } from '~/routes';

import { TenantCreatedSuccessModal } from './TenantCreatedSuccessModal';

export const CreateTenantPage = () => {
  const navigate = useNavigate();

  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm<CreateTenantInput>({
    resolver: zodResolver(CreateTenantSchema),
    mode: 'onTouched',
  });

  const { mutate: createTenant } = useCreateTenantMutation();

  const [createdTenant, setCreatedTenant] = useState<Tenant | null>(null);

  const handleBack = () => navigate(-1);

  const onSubmit = async (data: CreateTenantInput) => {
    createTenant(data, {
      onSuccess: (tenant: Tenant) => {
        setCreatedTenant(tenant);
      },
      onError: (err) => {
        const errorMessage = parseBackendError(err);
        toast.error(`Failed to create tenant: ${errorMessage}`);
      },
    });
  };

  const handleNavigateToTenant = () => {
    if (!createdTenant) return;

    navigate(
      pathFor({
        pathname: AdminRoutes.TenantHome,
        params: { tenantId: createdTenant.id },
      }),
    );

    setCreatedTenant(null);
  };

  const handleStayOnPage = () => {
    reset();
    setCreatedTenant(null);
    toast.success(`Successfully created ${createdTenant?.name}`);
  };

  return (
    <PageLayout>
      <PageContainer spacing={3}>
        <Form onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          <PageHeader
            title="Create Tenant"
            description="A tenant represents your company or organization within the platform. Creating a tenant allows you to manage users, data, and reports independently—ensuring your operations are securely separated from your other businesses using the system."
          />
          <Stack spacing={3}>
            {/* General Info */}
            <Stack spacing={1} bgcolor="background.paper" borderRadius={2} p={2}>
              <Typography variant="h6" fontWeight="medium">
                General Information
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
            {/* Goverment Info */}
            <Stack spacing={1} bgcolor="background.paper" borderRadius={2} p={2}>
              <Typography variant="h6" fontWeight="medium">
                Government IDs
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
                pattern="99-9999999999-9"
                placeholder="12-3456789012-3"
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
        </Form>
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
        <Button variant="outlined" onClick={handleBack}>
          Cancel
        </Button>
        <Button disabled={!isValid} variant="contained" type="submit">
          Create Tenant
        </Button>
      </Stack>

      <TenantCreatedSuccessModal
        open={!!createdTenant}
        tenantName={createdTenant?.name ?? ''}
        onClose={handleStayOnPage}
        onNavigateToTenant={handleNavigateToTenant}
      />
    </PageLayout>
  );
};
