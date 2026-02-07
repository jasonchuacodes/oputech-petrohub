import { Stack, Typography } from '@mui/material';
import type { Control } from 'react-hook-form';

import { InputWithFormat } from '~/components/form';
import type { UpdateUserPayload } from '~/schema/updateUserSchema';

interface GovernmentDetailsProps {
  control: Control<UpdateUserPayload>;
}

export const GovernmentDetails = ({ control }: GovernmentDetailsProps) => {
  return (
    <Stack spacing={1} bgcolor="background.paper" borderRadius={2} p={2}>
      <Stack spacing={0.5}>
        <Typography variant="h6" fontWeight="medium">
          Government IDs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Government-issued information for reference
        </Typography>
      </Stack>
      <InputWithFormat
        control={control}
        name="tin"
        label="TIN"
        pattern="999-999-999-999"
        placeholder="000-000-000-000"
      />

      <InputWithFormat
        control={control}
        name="sss"
        label="SSS"
        pattern="99-9999999-9"
        placeholder="00-0000000-0"
      />

      <InputWithFormat
        control={control}
        name="pagibig"
        label="PAG-IBIG"
        pattern="99-9999999999-9"
        placeholder="00-0000000000-0"
      />

      <InputWithFormat
        control={control}
        name="philhealth"
        label="PhilHealth"
        pattern="9999-9999-9999"
        placeholder="0000-0000-0000"
      />
    </Stack>
  );
};
