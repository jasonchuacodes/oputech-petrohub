import { zodResolver } from '@hookform/resolvers/zod';
import { Container, List, Stack, Typography } from '@mui/material';
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
    <Form onSubmit={onSubmit} sx={{ display: 'flex', width: '100%' }}>
      <Container maxWidth="sm" disableGutters sx={{ margin: 0 }}>
        <Stack justifyContent="center" alignItems="center" spacing={2} p={3}>
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
        </Stack>
      </Container>

      <Stack
        px={3}
        py={2}
        width="100%"
        bgcolor="background.paper"
        direction="row"
        spacing={1}
        justifyContent="end"
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button disabled={!isValid || isUpdatePasswordPending} type="submit" variant="contained">
          Change Password
        </Button>
      </Stack>
    </Form>
  );
};
