import { Box, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import { PageLayout } from '~/components/ui';

import { SettingsTabPanel } from './SettingsTabPanel';
import { AccountSettings } from './Account';
import { SecuritySettings } from './Security';

export const AdminSettingsPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <PageLayout spacing={2} p={3}>
      <Stack spacing={0.5}>
        <Typography variant="h6">
          Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your company profile and preferences.
        </Typography>
      </Stack>
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Account" />
          <Tab label="Security" />
        </Tabs>
      </Box>

      <Container maxWidth="md" disableGutters>
        <SettingsTabPanel index={0} value={value}>
          <AccountSettings />
        </SettingsTabPanel>
        <SettingsTabPanel index={1} value={value}>
          <SecuritySettings />
        </SettingsTabPanel>
      </Container>
    </PageLayout>
  );
};
