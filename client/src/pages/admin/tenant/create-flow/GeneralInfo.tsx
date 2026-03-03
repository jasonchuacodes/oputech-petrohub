import { Stack } from '@mui/material';
import type { Control } from 'react-hook-form';

import { InputWithFormat, Input } from '~/components/form';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type GeneralInfoProps = {
  control: Control<CreateTenantInput>;
};

export const GeneralInfo = ({ control }: GeneralInfoProps) => {
  return (
    <Stack spacing={2} justifyContent="start" alignItems="start">
      <Input control={control} name="name" label="Company Name" required placeholder="ABC Corporation" />
      <Input control={control} name="email" label="Email Address" required placeholder="hello@abc.com" />
      <InputWithFormat
        control={control}
        name="contact"
        label="Contact"
        required
        pattern="9999-999-9999"
        placeholder="0925-123-1234"
      />
      <Input control={control} name="address" label="Address" placeholder="123 Main Street..." />
    </Stack>
  );
};
