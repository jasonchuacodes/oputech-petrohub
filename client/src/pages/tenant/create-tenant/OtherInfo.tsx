import { AddOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import type { UseFormRegister } from 'react-hook-form';

import { FormRow, TextField } from '~/components/form';
import { Button, StepNavigation } from '~/components/ui';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type OtherInfoProps = {
  register: UseFormRegister<CreateTenantInput>;
  onPrevious: () => void;
  onNext: () => void;
};

export const OtherInfo = ({ register, onNext, onPrevious }: OtherInfoProps) => {
  return (
    <Stack>
      <Stack spacing={3} justifyContent="start" alignItems="start">
        <FormRow label="Description">
          <TextField
            multiline
            rows={3}
            name="name"
            register={register}
            placeholder="Add a brief description"
            sx={{ textarea: { resize: 'vertical' } }}
          />
        </FormRow>
        <FormRow label="Documents">
          <Stack alignItems="end" direction="row" spacing={1} width="100%">
            <Button startIcon={<AddOutlined />} variant="outlined">
              Upload Files
            </Button>
            <Typography variant="caption">{`(Max 5 files, up to 10MB)`}</Typography>
          </Stack>
        </FormRow>
      </Stack>
      <StepNavigation onNext={onNext} onPrevious={onPrevious} nextLabel="Create Tenant" />
    </Stack>
  );
};
