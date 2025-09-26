import { Avatar, Divider, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

import { InputWithFormat, TextField } from '~/components/form';
import { Button, PageLayout } from '~/components/ui';

export const SettingsPage = () => {
  const { control } = useForm();

  return (
    <PageLayout p={2} spacing={2}>
      <Stack justifyContent="center" alignItems="center" spacing={2} pb={2}>
        <Stack width="100%" spacing={0.5}>
          <Typography fontWeight="bold" color="text.secondary">
            Personal Information:
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Manage your basic account information here.
          </Typography>
        </Stack>

        {/* TODO: avatar uploader */}
        <Avatar alt="profile-picture" sx={{ width: 64, height: 64 }}>
          <Typography fontSize="inherit">U</Typography>
        </Avatar>

        <Stack width="100%" spacing={1}>
          <TextField name="name" label="Full name" placeholder="Enter first name" />
          <TextField name="email" label="Email" placeholder="abc@gmail.com" />
          <TextField name="address" label="Address" placeholder="123 Main Street, ABC City, ..." />
          <InputWithFormat
            control={control}
            name="contact"
            label="Contact"
            pattern="9999-999-9999"
            placeholder="0912-345-6789"
          />
        </Stack>

        <Divider sx={{ width: '100%' }} />
        {/* Government */}
        <Stack width="100%" spacing={2}>
          <Stack spacing={0.5}>
            <Typography fontWeight="bold" color="text.secondary">
              Government Information:
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Government-issued identification numbers linked to the user for verification and
              record-keeping.
            </Typography>
          </Stack>
          <InputWithFormat
            control={control}
            label="TIN"
            name="tin"
            pattern="999-999-999-999"
            placeholder="123-456-789-101"
          />
          <InputWithFormat
            control={control}
            label="SSS"
            name="sss"
            pattern="99-9999999-9"
            placeholder="12-3456789-0"
          />
          <InputWithFormat
            control={control}
            label="PAGIBIG"
            name="pagibig"
            pattern="99-9999999999-9"
            placeholder="12-3456789012-3"
          />
          <InputWithFormat
            control={control}
            label="PHILHEALTH"
            name="philhealth"
            pattern="9999-9999-9999"
            placeholder="1234-5678-9012"
          />
        </Stack>

        <Divider sx={{ width: '100%' }} />

        <Stack width="100%" direction="row" spacing={1}>
          <Button disableElevation={true} onClick={() => null} type="button" variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" onClick={() => null}>
            Save
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
};
