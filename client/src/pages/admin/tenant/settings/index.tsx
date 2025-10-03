import { zodResolver } from '@hookform/resolvers/zod';
import { Container, FormHelperText, Stack, Typography } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { FormRow, InputWithFormat, TextField } from '~/components/form';
import { Button, Form, PageLayout } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { UpdateTenantSchema, type UpdateTenantInput } from '~/schema/updateTenantSchema';

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
  const navigate = useNavigate();
  const { tenant } = useTenantContext();

  const {
    control,
    register,
    formState: { isValid, isDirty, errors },
    handleSubmit,
    reset,
  } = useForm<UpdateTenantInput>({
    defaultValues: initialValues,
    resolver: zodResolver(UpdateTenantSchema),
  });

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

  const handleBack = () => navigate(-1);

  useEffect(() => {
    console.log('VALIDITY:', isValid);
    console.log('ERRORS:', errors);
  }, [isValid, errors]);

  const onSubmit = async (data: UpdateTenantInput) => {
    console.log('UPDATE DATA: ', data);
    reset();
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
            <Typography fontWeight="bold" variant="h5">
              Tenant Settings
            </Typography>
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
                <Button disabled startIcon={<AddOutlined />} variant="outlined">
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
            {isDirty && (
              <Button variant="outlined" onClick={handleBack}>
                Cancel
              </Button>
            )}
            <Button disabled={!isValid || !isDirty} variant="contained" type="submit">
              Save
            </Button>
          </Stack>
        </Form>
      </Container>
    </PageLayout>
  );
};
