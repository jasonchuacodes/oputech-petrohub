import { zodResolver } from '@hookform/resolvers/zod';
import { Container, FormHelperText, Stack, Typography } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { FormRow, InputWithFormat, TextField } from '~/components/form';
import { Button, Form, PageLayout } from '~/components/ui';
import { AdminRoutes } from '~/routes';
import { CreateTenantSchema, type CreateTenantInput } from '~/schema/createTenantSchema';
import { useCreateTenantMutation } from '~/services/tenant/tenant.queries';
import { parseBackendError } from '~/utils/parseBackendError';
import { pathFor } from '~/utils/pathFor';

export const CreateTenant = () => {
  const navigate = useNavigate();

  const {
    control,
    register,
    formState: { isValid, errors },
    handleSubmit,
    reset,
  } = useForm<CreateTenantInput>({
    resolver: zodResolver(CreateTenantSchema),
  });

  const { mutateAsync: createTenant } = useCreateTenantMutation();

  const handleBack = () => navigate(-1);

  const onSubmit = async (data: CreateTenantInput) => {
    let countdown = 5;
    try {
      const tenant = await createTenant(data);

      const toastId = toast.success(
        `Successfully created tenant. Redirecting in ${countdown} second${countdown > 1 ? 's' : ''}.`,
        { duration: 6000 },
      );

      const interval = setInterval(() => {
        countdown--;

        toast.success(
          `Successfully created tenant. Redirecting in ${countdown} second${countdown > 1 ? 's' : ''}.`,
          { id: toastId },
        );

        if (countdown === 0) {
          clearInterval(interval);
          navigate(
            pathFor({
              pathname: AdminRoutes.TenantHome,
              params: { tenantId: tenant.id },
            }),
          );
          toast.dismiss(toastId);
          reset();
        }
      }, 1000);
    } catch (err) {
      const errorMessage = parseBackendError(err);
      toast.error(`Failed to create tenant: ${errorMessage}`);
    }
  };

  return (
    <PageLayout p={3}>
      <Container maxWidth="md" disableGutters>
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
              <Typography fontWeight="bold" variant="h5">
                Create Tenant
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                A <strong>tenant</strong> represents your company or organization within the
                platform. Creating a tenant allows you to manage users, data, and reports
                independently—ensuring your operations are securely separated from your other
                businesses using the system.
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={3}>
            {/* General Info */}
            <Stack spacing={2} justifyContent="start" alignItems="start">
              <Stack>
                <Typography variant="h6" fontWeight="bold">
                  General
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Provide your company’s basic details. This information helps identify and
                  distinguish your organization within the platform.
                </Typography>
              </Stack>
              <FormRow label="Name" required>
                <TextField register={register} name="name" placeholder="ABC Corporation" />
              </FormRow>
              <FormRow label="Email Address" required>
                <TextField register={register} name="email" placeholder="hello@abc.com" />
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
                <TextField register={register} name="address" placeholder="123 Main Street..." />
              </FormRow>
            </Stack>

            {/* Goverment Info */}
            <Stack spacing={2} justifyContent="start" alignItems="start">
              <Stack>
                <Typography variant="h6" fontWeight="bold">
                  Government
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
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
                <Typography variant="h6" fontWeight="bold">
                  Additional Information
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Basic information about your company. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Dolore, vitae.
                </Typography>
              </Stack>
              <TextField
                multiline
                rows={3}
                name="description"
                register={register}
                placeholder="Add a brief description"
                sx={{ textarea: { resize: 'vertical' } }}
              />
              <Stack alignItems="end" direction="row" spacing={1} width="100%">
                <Button startIcon={<AddOutlined />} variant="outlined">
                  Upload Files
                </Button>
                <Typography variant="caption">{`(Max 5 files, up to 10MB)`}</Typography>
              </Stack>
            </Stack>
          </Stack>
          <FormHelperText error component="div">
            {Object.values(errors || {}).map((error, index) => (
              <Typography key={index} component="p" mb={0.5}>
                {error?.message?.toString()}
              </Typography>
            ))}
          </FormHelperText>
          <Stack justifyContent="end" direction="row" spacing={1} my={5}>
            <Button disabled={!isValid} variant="contained" type="submit">
              Create Tenant
            </Button>
            <Button variant="outlined" onClick={handleBack}>
              Cancel
            </Button>
          </Stack>
        </Form>
      </Container>
    </PageLayout>
  );
};
