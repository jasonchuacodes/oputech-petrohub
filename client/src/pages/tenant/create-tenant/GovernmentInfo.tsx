import { Stack } from '@mui/material';
import type { UseFormRegister } from 'react-hook-form';

import { FormRow, TextField } from '~/components/form';
import { StepNavigation } from '~/components/ui';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type GovernmentInfoProps = {
  register: UseFormRegister<CreateTenantInput>;
  onPrevious: () => void;
  onNext: () => void;
};

export const GovernmentInfo = ({ register, onNext, onPrevious }: GovernmentInfoProps) => {
  return (
    <>
      <Stack spacing={3} justifyContent="start" alignItems="start">
        <FormRow label="TIN">
          <TextField
            name="name"
            register={register}
            placeholder="123-456-789-000"
            variant="standard"
          />
        </FormRow>
        <FormRow label="SSS">
          <TextField
            name="name"
            register={register}
            placeholder="34-1234567-8"
            variant="standard"
          />
        </FormRow>
        <FormRow label="PAGIBIG">
          <TextField
            name="name"
            register={register}
            placeholder="12-3456778901-2"
            variant="standard"
          />
        </FormRow>
        <FormRow label="PHILHEALTH">
          <TextField
            name="name"
            register={register}
            placeholder="1234-4567-9012"
            variant="standard"
          />
        </FormRow>
      </Stack>
      <StepNavigation onNext={onNext} onPrevious={onPrevious} />
    </>
  );
};
