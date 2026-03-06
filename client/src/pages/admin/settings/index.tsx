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
      <Stack p={3} spacing={3} flex={1} overflow="hidden">
        <PageHeader
          title="Account Settings"
          description=" Manage your company profile and preferences."
        />
        <Stack overflow="hidden" bgcolor="background.surface" borderRadius={2}>
          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Account" />
              <Tab label="Security" />
            </Tabs>
          </Box>

          <Stack flex={1} overflow="auto">
            <SettingsTabPanel index={0} value={value}>
              <AccountSettings />
            </SettingsTabPanel>
            <SettingsTabPanel index={1} value={value}>
              <SecuritySettings />
            </SettingsTabPanel>
          </Stack>
        </Stack>
      </Stack>
    </PageLayout>
  );
};
