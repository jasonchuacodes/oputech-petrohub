import { Container, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ContentCard, PageLayout } from '~/components/ui';
import { CreateTenantSchema, type CreateTenantInput } from '~/schema/createTenantSchema';

import { CreateTenantPrompt } from './CreateTenantPrompt';
import { GovernmentInfo } from './GovernmentInfo';
import { OrganizationInfo } from './OrganizationInfo';
import { OtherInfo } from './OtherInfo';

export const CreateTenantFlow = () => {
  const [stepIndex, setStepIndex] = useState<number>(-1);

  const nextStep = () => setStepIndex((prev) => (prev >= 3 ? 3 : prev + 1));
  const prevStep = () => setStepIndex((prev) => prev - 1);

  const { register } = useForm<CreateTenantInput>({
    resolver: zodResolver(CreateTenantSchema),
  });

  const renderCreateTenantStep = () => {
    switch (stepIndex) {
      case 0:
        return <OrganizationInfo onPrevious={prevStep} onNext={nextStep} register={register} />;
      case 1:
        return <GovernmentInfo onPrevious={prevStep} onNext={nextStep} register={register} />;
      case 2:
        return <OtherInfo onPrevious={prevStep} onNext={nextStep} register={register} />;

      default:
        return null;
    }
  };

  const renderCreateTenantStepInfo = () => {
    switch (stepIndex) {
      case 0:
        return 'Set up your organization or company to start using the platform. This will serve as the foundation for managing your team, resources, and settings.';

      case 1:
        return 'This step is optional, but providing your business’s official government information helps ensure smoother compliance, reporting, and operational integrations later on. \n \n You can always complete or update this section anytime from your settings.';

      case 2:
        return 'Help us better understand your organization by providing a short description and any relevant documents (e.g., permits, registrations, or certifications). \n \n These details strengthen your company profile and help us tailor features and support to your business needs.';

      default:
        return '';
    }
  };

  return (
    <PageLayout>
      <Container
        maxWidth="lg"
        sx={{
          mt: 8,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {stepIndex === -1 ? (
          <CreateTenantPrompt onStart={() => setStepIndex(0)} />
        ) : (
          <ContentCard sx={{ maxWidth: 'sm' }}>
            <Typography variant="h5" fontWeight="bold" textAlign="start">
              Create Tenant
            </Typography>
            <Stack spacing={1}>
              <RadioGroup
                row
                value={stepIndex}
                onChange={(e) => {
                  setStepIndex(Number(e.target.value));
                }}
                sx={{ display: 'flex' }}
              >
                {[
                  { label: 'General Info' },
                  { label: 'Government Info' },
                  { label: 'Other Info' },
                ].map(({ label }, index) => {
                  return (
                    <FormControlLabel key={index} value={index} control={<Radio />} label={label} />
                  );
                })}
              </RadioGroup>
              <Typography
                component="p"
                variant="body2"
                sx={{ textAlign: 'start', fontStyle: 'italic', whiteSpace: 'pre-line' }}
              >
                {renderCreateTenantStepInfo()}
              </Typography>
            </Stack>

            {renderCreateTenantStep()}
          </ContentCard>
        )}
      </Container>
    </PageLayout>
  );
};
