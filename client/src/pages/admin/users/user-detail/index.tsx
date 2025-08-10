import { zodResolver } from '@hookform/resolvers/zod';
import { EditOutlined } from '@mui/icons-material';
import { Container, Stack, Typography } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';

import { FormRow, InputWithFormat, TextField } from '~/components/form';
import { Button, PageLayout } from '~/components/ui';
import { user } from '~/data/mockUserDetail';
import { UpdateUserSchema, type UpdateUserInput } from '~/schema/updateUserSchema';
import { pathFor } from '~/utils/pathFor';
import { AdminRoutes } from '~/routes';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { BackButton } from '~/components/ui';

export const UserDetailPage = () => {
  const { tenantId } = useTenantContext();

  const [mode, setMode] = useState<'view' | 'edit'>('view');

  const { control, register } = useForm<UpdateUserInput>({
    defaultValues: user,
    resolver: zodResolver(UpdateUserSchema),
  });

  const { name, address } = useWatch({ control });

  const handleToggleMode = () => (mode === 'view' ? setMode('edit') : setMode('view'));

  return (
    <PageLayout p={3}>
      <Container maxWidth="md" disableGutters>
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
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
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
                  {...register('name')}
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
                  {...register('address')}
                  mode={mode}
                  value={address}
                  name="address"
                  placeholder="123 Main Street..."
                />
              </FormRow>
            </Stack>
          </Stack>
          <Stack spacing={2} justifyContent="start" alignItems="start">
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
                  placeholder="123-456-789-000"
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
        </Stack>
        {mode === 'edit' && (
          <Stack justifyContent="start" direction="row" spacing={1} my={5}>
            <Button variant="contained" type="submit">
              Update User
            </Button>
            <Button variant="outlined" onClick={handleToggleMode}>
              Cancel
            </Button>
          </Stack>
        )}
      </Container>
    </PageLayout>
  );
};
