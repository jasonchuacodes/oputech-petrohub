import { Stack } from '@mui/material';
import type { Control } from 'react-hook-form';

import { InputWithFormat } from '~/components/form';
import type { CreateTenantInput } from '~/schema/createTenantSchema';

type GovernmentInfoProps = {
  control: Control<CreateTenantInput>;
};

export const GovernmentInfo = ({ control }: GovernmentInfoProps) => {
  return (
    <Stack spacing={2} justifyContent="start" alignItems="start">
      <InputWithFormat control={control} name="tin" label="TIN" pattern="999-999-999-999" placeholder="123-456-789-000" />
      <InputWithFormat control={control} name="sss" label="SSS" pattern="99-9999999-9" placeholder="12-3456789-0" />
      <InputWithFormat control={control} name="pagibig" label="PAGIBIG" pattern="99-9999999999-9" placeholder="12-3456789012-3" />
      <InputWithFormat control={control} name="philhealth" label="PHILHEALTH" pattern="9999-9999-9999" placeholder="1234-5678-9012" />
    </Stack>
  );
};
