import { AddOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import type { Control } from 'react-hook-form';

import { FormRow, Input } from '~/components/form';
import { Button } from '~/components/ui';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type OtherInfoProps = {
  control: Control<CreateTenantInput>;
};

export const OtherInfo = ({ control }: OtherInfoProps) => {
  return (
    <Stack spacing={4}>
      <Stack spacing={2} justifyContent="start" alignItems="start">
        <FormRow alignLabel="flex-start" label="Description">
          <Input
            multiline
            rows={3}
            name="description"
            control={control}
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
