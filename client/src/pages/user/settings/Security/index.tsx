import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, List, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { PasswordField } from '~/components/form';
import { Button, Form, InfoBox } from '~/components/ui';
import { UpdatePasswordSchema, type UpdatePasswordInput } from '~/schema/updatePasswordSchema';
import { useUpdatePasswordMutation } from '~/services/auth/auth.queries';
import { parseBackendError } from '~/utils/parseBackendError';

export const SecuritySettings = () => {
  const navigate = useNavigate();

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(UpdatePasswordSchema),
    mode: 'onChange',
  });

  const { mutate: updatePassword, isPending: isUpdatePasswordPending } =
    useUpdatePasswordMutation();

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  const onSubmit = handleSubmit((data: UpdatePasswordInput) => {
    const { oldPassword, newPassword } = data;

    updatePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          toast.success('Password updated successfully!');
          reset();
        },
        onError: (err) => {
          const errorMessage = parseBackendError(err);
          toast.error(`Failed to update password: ${errorMessage}`);
        },
      },
    );
  });

  return (
    <Stack spacing={2}>
      <Form onSubmit={onSubmit}>
        <Stack justifyContent="center" alignItems="center" spacing={2} pb={2}>
          <Stack spacing={1} width="100%">
            <PasswordField
              required
              control={control}
              name="oldPassword"
              label="Old Password"
              placeholder="Enter your old password"
              randomizer={false}
            />
            <PasswordField
              required
              control={control}
              name="newPassword"
              label="New Password"
              placeholder="Enter your new password"
              randomizer={false}
            />
            <InfoBox variant="info" title="Password requirements:">
              <List sx={{ listStyleType: 'disc', pl: 2, m: 0 }}>
                {[
                  'At least 8 characters',
                  'One uppercase letter (A-Z)',
                  'One lowercase letter (a-z)',
                  'One number (0-9)',
                  'One special character (e.g. !@#$%^&*)',
                ].map((item) => (
                  <Typography key={item} component="li" fontSize="small" sx={{ pl: 1 }}>
                    {item}
                  </Typography>
                ))}
              </List>
            </InfoBox>
            <PasswordField
              required
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Enter you confirm new password"
              randomizer={false}
            />
          </Stack>

          <Divider sx={{ width: '100%' }} />
          <Stack width="100%" direction="row" spacing={1}>
            <Button disableElevation={true} onClick={handleCancel} type="button" variant="outlined">
              Cancel
            </Button>
            <Button
              disabled={!isValid || isUpdatePasswordPending}
              type="submit"
              variant="contained"
            >
              Change Password
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Stack>
  );
};
