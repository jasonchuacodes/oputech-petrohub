import { Stack } from '@mui/material';
import type { UseFormRegister } from 'react-hook-form';

import { StepNavigation } from '~/components/ui';
import { FormRow } from '~/components/form/FormRow';
import { TextField } from '~/components/form/TextField';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type OrganizationInfoProps = {
  register: UseFormRegister<CreateTenantInput>;
  onPrevious: () => void;
  onNext: () => void;
};

export const OrganizationInfo = ({ register, onNext, onPrevious }: OrganizationInfoProps) => {
  return (
    <>
      <Stack spacing={3} justifyContent="start" alignItems="start">
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
          <TextField name="contact" register={register} placeholder="John Doe" variant="standard" />
        </FormRow>
        <FormRow label="Address" required>
          <TextField
            name="address"
            register={register}
            placeholder="123 Main Street..."
            variant="standard"
          />
        </FormRow>
      </Stack>

      <StepNavigation onNext={onNext} onPrevious={onPrevious} />
    </>
  );
};
