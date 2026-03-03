import { Typography, Stack } from '@mui/material';

import { Button, ContentCard } from '~/components/ui';

export const CreateTenantPrompt = ({ onStart }: { onStart: () => void }) => {
  return (
    <ContentCard>
      <Typography variant="h5" fontWeight={600}>
        Welcome, Admin!
      </Typography>

      <Stack spacing={2}>
        <Typography variant="body2" color='text.primary'>
          Before we get started, let’s set up your organization.
        </Typography>
        <Typography variant="body2" color='text.primary'>
          This quick 3-step process will help us tailor the platform to your team’s needs.
        </Typography>
      </Stack>

      <Button variant="contained" onClick={onStart}>
        Let's start the setup
      </Button>
    </ContentCard>
  );
};
