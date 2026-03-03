import { AddOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import type { Control } from 'react-hook-form';

import { Input } from '~/components/form';
import { Button } from '~/components/ui';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type OtherInfoProps = {
  control: Control<CreateTenantInput>;
};

export const OtherInfo = ({ control }: OtherInfoProps) => {
  return (
    <Stack spacing={4}>
      <Stack spacing={2} justifyContent="start" alignItems="start">
        <Input
          multiline
          rows={3}
          name="description"
          control={control}
          label="Description"
          placeholder="Add a brief description"
        />
        <Stack alignItems="end" direction="row" spacing={1} width="100%">
          <Button startIcon={<AddOutlined />} variant="outlined">
            Upload Files
          </Button>
          <Typography variant="caption">{`(Max 5 files, up to 10MB)`}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
