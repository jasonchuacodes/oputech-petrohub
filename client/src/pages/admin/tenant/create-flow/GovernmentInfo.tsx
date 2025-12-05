import { Stack } from '@mui/material';
import type { Control } from 'react-hook-form';

import { FormRow, InputWithFormat } from '~/components/form';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type GovernmentInfoProps = {
  control: Control<CreateTenantInput>;
};

export const GovernmentInfo = ({ control }: GovernmentInfoProps) => {
  return (
    <>
      <Stack spacing={2} justifyContent="start" alignItems="start">
        <FormRow label="TIN">
          <InputWithFormat
            control={control}
            pattern="999-999-999-999"
            placeholder="123-456-789-000"
            name="tin"
          />
        </FormRow>
        <FormRow label="SSS">
          <InputWithFormat
            control={control}
            pattern="99-9999999-9"
            placeholder="12-3456789-0"
            name="sss"
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
        <FormRow label="PHILHEALTH">
          <InputWithFormat
            control={control}
            pattern="9999-9999-9999"
            placeholder="1234-5678-9012"
            name="philhealth"
          />
        </FormRow>
      </Stack>
    </>
  );
};
