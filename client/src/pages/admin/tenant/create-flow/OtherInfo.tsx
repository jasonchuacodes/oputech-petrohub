import { AddOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import type { UseFormRegister } from 'react-hook-form';

import { FormRow, TextField } from '~/components/form';
import { Button } from '~/components/ui';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type OtherInfoProps = {
  register: UseFormRegister<CreateTenantInput>;
};

export const OtherInfo = ({ register }: OtherInfoProps) => {
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
    </Stack>
  );
};
