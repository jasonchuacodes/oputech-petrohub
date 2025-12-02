import { Typography, Stack } from '@mui/material';

import { Button, ContentCard } from '~/components/ui';

export const CreateTenantPrompt = ({ onStart }: { onStart: () => void }) => {
  return (
    <ContentCard>
      <Typography variant="h6">
        Welcome, Admin!
      </Typography>

      <Stack spacing={2}>
        <Typography variant="body2">
          Before we get started, let’s set up your organization. This quick 3-step process will help
          us tailor the platform to your team’s needs.
        </Typography>
        <Typography variant="body2">
          Once complete, you’ll have full access to the dashboard and its features.
        </Typography>
      </Stack>

      <Button variant="contained" onClick={onStart}>
        Let's start the setup
      </Button>
    </ContentCard>
  );
};
