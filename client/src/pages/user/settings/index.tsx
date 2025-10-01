import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { PageLayout } from '~/components/ui';

import { SettingsTabPanel } from './SettingsTabPanel';
import { AccountSettings } from './Account';
import { SecuritySettings } from './Security';

export const SettingsPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <PageLayout spacing={2}>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          px: 2,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 1,
        }}
      >
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Account" />
          <Tab label="Security" />
        </Tabs>
      </Box>

      <SettingsTabPanel index={0} value={value}>
        <AccountSettings />
      </SettingsTabPanel>
      <SettingsTabPanel index={1} value={value}>
        <SecuritySettings />
      </SettingsTabPanel>
    </PageLayout>
  );
};
