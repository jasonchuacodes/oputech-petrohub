import { Stack } from '@mui/material';
import type { Control } from 'react-hook-form';

import { FormRow, InputWithFormat, Input } from '~/components/form';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type GeneralInfoProps = {
  control: Control<CreateTenantInput>;
};

export const GeneralInfo = ({ control }: GeneralInfoProps) => {
  return (
    <>
      <Stack spacing={2} justifyContent="start" alignItems="start">
        <FormRow label="Company Name" required>
          <Input control={control} name="name" placeholder="ABC Corporation" />
        </FormRow>
        <FormRow label="Email Address" required>
          <Input control={control} name="email" placeholder="hello@abc.com" />
        </FormRow>
        <FormRow label="Contact" required>
          <InputWithFormat
            control={control}
            name="contact"
            pattern="9999-999-9999"
            placeholder="0925-123-1234"
          />
        </FormRow>
        <FormRow label="Address">
          <Input control={control} name="address" placeholder="123 Main Street..." />
        </FormRow>
      </Stack>
    </>
  );
};
