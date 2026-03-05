import { Stack } from '@mui/material';
import type { Control } from 'react-hook-form';

import { type UpdateUserPayload } from '~/schema/updateUserSchema';
import { FormDatePicker, Input, InputWithFormat } from '~/components/form';
import type { User } from '~/services/user/user.types';

import { AvatarPicker } from './AvatarPicker';

interface BasicDetailProps {
  control: Control<UpdateUserPayload>;
  user?: User;
}

export const BasicDetail = ({ control, user }: BasicDetailProps) => {
  return (
    <Stack spacing={2} bgcolor="background.paper" borderRadius={2} p={2}>
      <AvatarPicker name={user?.username} />

      <Stack spacing={1}>
        <Input
          required
          fullWidth
          control={control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
        />
        <InputWithFormat
          control={control}
          name="contact"
          label="Contact Number"
          pattern="9999-999-9999"
          placeholder="0000-000-0000"
        />
        <FormDatePicker control={control} name="birthday" label="Birthday" disableFuture />
        <Input control={control} name="address" label="Address" placeholder="Manila, Philippines" />
      </Stack>
    </Stack>
  );
};
