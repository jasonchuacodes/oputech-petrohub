import { zodResolver } from '@hookform/resolvers/zod';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Divider, IconButton, List, OutlinedInput, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { Button, Form, InfoBox } from '~/components/ui';
import { UpdatePasswordSchema, type UpdatePasswordInput } from '~/schema/updatePasswordSchema';

export const SecuritySettings = () => {
  const navigate = useNavigate();

  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
  });

  const handleCancel = () => {
    reset();
    navigate(-1);
  };

  const onSubmit = handleSubmit((data: UpdatePasswordInput) => {
    console.log('PASSWORD DATA: ', data);
    reset()
  });

  return (
    <Stack spacing={2}>
      <Form onSubmit={onSubmit}>
        <Stack justifyContent="center" alignItems="center" spacing={2} pb={2}>
          <Stack spacing={1} width="100%">
            <Stack spacing={0.5}>
              <Typography fontWeight="bold" color="text.secondary">
                Old Password
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              </Typography>
              <OutlinedInput
                {...register('oldPassword')}
                size="small"
                type={isShowOldPassword ? 'text' : 'password'}
                placeholder="Enter your old password"
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => setIsShowOldPassword(!isShowOldPassword)}
                    edge="end"
                  >
                    {isShowOldPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                  </IconButton>
                }
              />
            </Stack>

            <Stack spacing={0.5}>
              <Typography fontWeight="bold" color="text.secondary">
                New Password
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              </Typography>
              <OutlinedInput
                {...register('newPassword')}
                size="small"
                type={isShowNewPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                    edge="end"
                  >
                    {isShowNewPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                  </IconButton>
                }
              />
            </Stack>
            <InfoBox variant="info" title="Password requirements:">
              <List sx={{ listStyleType: 'disc', pl: 3, m: 0 }}>
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
            <Stack spacing={0.5}>
              <Typography fontWeight="bold" color="text.secondary">
                Confirm Password
                <Typography component="span" color="error">
                  {' '}
                  *
                </Typography>
              </Typography>
              <OutlinedInput
                {...register('confirmPassword')}
                size="small"
                type={isShowConfirmPassword ? 'text' : 'password'}
                placeholder="Enter you confirm new password"
                endAdornment={
                  <IconButton
                    size="small"
                    onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                    edge="end"
                  >
                    {isShowConfirmPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                  </IconButton>
                }
              />
            </Stack>
          </Stack>

          <Divider sx={{ width: '100%' }} />
          <Stack width="100%" direction="row" spacing={1}>
            <Button disableElevation={true} onClick={handleCancel} type="button" variant="outlined">
              Cancel
            </Button>
            <Button disabled={!isValid} type="submit" variant="contained">
              Change Password
            </Button>
          </Stack>
        </Stack>
      </Form>
    </Stack>
  );
};
