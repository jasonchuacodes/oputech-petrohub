import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { PageHeader } from '~/components/layouts';
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
    <PageLayout>
      <Stack spacing={3} p={3}>
        <PageHeader
          title="Account Settings"
          description=" Manage your company profile and preferences."
        />
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
      </Stack>

      <Stack flex={1} overflow="auto" width="100%" height="100%">
        <SettingsTabPanel index={0} value={value}>
          <AccountSettings />
        </SettingsTabPanel>
        <SettingsTabPanel index={1} value={value}>
          <SecuritySettings />
        </SettingsTabPanel>
      </Stack>
    </PageLayout>
  );
};
