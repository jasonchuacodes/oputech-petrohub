import { zodResolver } from '@hookform/resolvers/zod';
import { Container, Divider, Stack, Typography } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { FormRow, InputWithFormat, Input } from '~/components/form';
import { Button, Form, PageLayout } from '~/components/ui';
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
    <PageLayout p={3}>
      <Container maxWidth="lg" disableGutters>
        <Form onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          {/* Header */}
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            width="100%"
            mb={4}
          >
            <Stack>
              <Typography variant="h6">Create Tenant</Typography>
              <Typography variant="body2" color="text.secondary">
                A <strong>tenant</strong> represents your company or organization within the
                platform. Creating a tenant allows you to manage users, data, and reports
                independently—ensuring your operations are securely separated from your other
                businesses using the system.
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={2} divider={<Divider />}>
            {/* General Info */}
            <Stack spacing={2} justifyContent="start" alignItems="start">
              <Stack>
                <Typography variant="body1" fontWeight="medium">
                  General
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provide your company’s basic details. This information helps identify and
                  distinguish your organization within the platform.
                </Typography>
              </Stack>
              <FormRow label="Name" required>
                <Input control={control} name="name" placeholder="ABC Corporation" />
              </FormRow>
              <FormRow label="Email Address" required>
                <Input control={control} name="email" placeholder="hello@abc.com" />
              </FormRow>

              <FormRow label="Contact number" required>
                <InputWithFormat
                  control={control}
                  name="contact"
                  pattern="9999-999-9999"
                  placeholder="0925-123-1234"
                  variant="outlined"
                />
              </FormRow>
              <FormRow label="Address">
                <Input control={control} name="address" placeholder="123 Main Street..." />
              </FormRow>
            </Stack>
            {/* Goverment Info */}
            <Stack spacing={2} justifyContent="start" alignItems="start">
              <Stack>
                <Typography variant="body1" fontWeight="medium">
                  Government
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Basic information about your company. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Dolore, vitae.
                </Typography>
              </Stack>
              <FormRow label="TIN">
                <InputWithFormat
                  control={control}
                  name="tin"
                  pattern="999-999-999-999"
                  placeholder="123-456-789-000"
                />
              </FormRow>

              <FormRow label="SSS">
                <InputWithFormat
                  control={control}
                  name="sss"
                  pattern="99-9999999-9"
                  placeholder="12-3456789-0"
                />
              </FormRow>

              <FormRow label="PAGIBIG">
                <InputWithFormat
                  control={control}
                  name="pagibig"
                  pattern="99-9999999999-9"
                  placeholder="12-3456789012-3"
                />
              </FormRow>

              <FormRow label="PhilHealth">
                <InputWithFormat
                  control={control}
                  name="philhealth"
                  pattern="9999-9999-9999"
                  placeholder="1234-5678-9012"
                />
              </FormRow>
            </Stack>
            {/* Other Info */}
            <Stack spacing={2} justifyContent="start" alignItems="start">
              <Stack>
                <Typography variant="body1" fontWeight="medium">
                  Additional Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Basic information about your company. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Dolore, vitae.
                </Typography>
              </Stack>
              <Input
                multiline
                rows={3}
                control={control}
                name="description"
                placeholder="Add a brief description"
                sx={{ textarea: { resize: 'vertical' } }}
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
            <Stack justifyContent="end" direction="row" pb={2} spacing={1} width="100%">
              <Button variant="outlined" onClick={handleBack}>
                Cancel
              </Button>
              <Button disabled={!isValid} variant="contained" type="submit">
                Create Tenant
              </Button>
            </Stack>
          </Stack>
        </Form>

        <TenantCreatedSuccessModal
          open={!!createdTenant}
          tenantName={createdTenant?.name ?? ''}
          onClose={handleStayOnPage}
          onNavigateToTenant={handleNavigateToTenant}
        />
      </Container>
    </PageLayout>
  );
};
