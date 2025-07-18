import { AddOutlined } from '@mui/icons-material';
import { FormHelperText, Stack, Typography } from '@mui/material';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { FormRow, TextField } from '~/components/form';
import { Button, StepNavigation } from '~/components/ui';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type OtherInfoProps = {
  register: UseFormRegister<CreateTenantInput>;
  onPrevious: () => void;
  onSubmit: () => void;
  errors?: FieldErrors<CreateTenantInput>;
};

export const OtherInfo = ({ errors, register, onSubmit, onPrevious }: OtherInfoProps) => {
  return (
    <Stack spacing={4}>
      <Stack spacing={2} justifyContent="start" alignItems="start">
        <FormRow alignLabel="flex-start" label="Description">
          <TextField
            multiline
            rows={3}
            name="description"
            register={register}
            placeholder="Add a brief description"
            sx={{ textarea: { resize: 'vertical' } }}
          />
        </FormRow>
        <FormRow alignLabel="flex-start" label="Documents">
          <Stack alignItems="end" direction="row" spacing={1} width="100%">
            <Button startIcon={<AddOutlined />} variant="outlined">
              Upload Files
            </Button>
            <Typography variant="caption">{`(Max 5 files, up to 10MB)`}</Typography>
          </Stack>
        </FormRow>
      </Stack>

      <FormHelperText error component='div'>
        {Object.values(errors || {}).map((error, index) => (
          <Typography key={index} component='p' mb={0.5}>
            {error?.message?.toString()}
          </Typography>
        ))}
      </FormHelperText>

      <StepNavigation onNext={onSubmit} onPrevious={onPrevious} nextLabel="Create Tenant" />
    </Stack>
  );
};
