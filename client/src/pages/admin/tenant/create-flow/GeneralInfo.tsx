import { Stack } from '@mui/material';
import type { Control, UseFormRegister } from 'react-hook-form';

import { FormRow, InputWithFormat, TextField } from '~/components/form';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type GeneralInfoProps = {
  control: Control<CreateTenantInput>;
  register: UseFormRegister<CreateTenantInput>;
};

export const GeneralInfo = ({ control, register }: GeneralInfoProps) => {
  return (
    <>
      <Stack spacing={2} justifyContent="start" alignItems="start">
        <FormRow label="Company Name" required>
          <TextField
            name="name"
            register={register}
            placeholder="ABC Corporation"
            variant="standard"
          />
        </FormRow>
        <FormRow label="Email Address" required>
          <TextField
            name="email"
            register={register}
            placeholder="hello@abc.com"
            variant="standard"
          />
        </FormRow>
        <FormRow label="Contact" required>
          <InputWithFormat
            control={control}
            name="contact"
            pattern="9999-999-9999"
            placeholder="0925-123-1234"
            variant="standard"
          />
        </FormRow>
        <FormRow label="Address">
          <TextField
            name="address"
            register={register}
            placeholder="123 Main Street..."
            variant="standard"
          />
        </FormRow>
      </Stack>
    </>
  );
};
