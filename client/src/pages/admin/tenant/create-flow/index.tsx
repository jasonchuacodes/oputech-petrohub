import {
  alpha,
  Box,
  Container,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { ContentCard, PageLayout, StepNavigation } from '~/components/ui';
import { useCreateTenantMutation } from '~/services/tenant/tenant.queries';
import { CreateTenantSchema, type CreateTenantInput } from '~/schema/createTenantSchema';
import theme from '~/theme';
import { parseBackendError } from '~/utils/parseBackendError';

import { CreateTenantPrompt } from './CreateTenantPrompt';
import { GovernmentInfo } from './GovernmentInfo';
import { GeneralInfo } from './GeneralInfo';
import { OtherInfo } from './OtherInfo';

const initialTenantForm = {
  contact: '',
  description: '',
  address: '',
  email: '',
  name: '',
};

const TOTAL_STEPS = 3;

export const CreateTenantFlow = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState<number>(-1);

  const nextStep = () => setStepIndex((prev) => (prev >= TOTAL_STEPS ? TOTAL_STEPS : prev + 1));
  const prevStep = () => setStepIndex((prev) => prev - 1);

  const isLastStep = stepIndex + 1 === TOTAL_STEPS;

  const {
    control,
    handleSubmit,
    register,
    reset,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<CreateTenantInput>({
    resolver: zodResolver(CreateTenantSchema),
    mode: 'onBlur',
    defaultValues: initialTenantForm,
  });

  const { mutate: createTenant, isPending: isCreatingTenant } = useCreateTenantMutation();

  const onSubmit = handleSubmit(async (data: CreateTenantInput) => {
    createTenant(data, {
      onSuccess: () => {
        toast.success('Successfully created tenant');
        reset();
        clearErrors();
        navigate('/');
      },
      onError: (err) => {
        const errorMessage = parseBackendError(err);
        toast.error(`Failed to create tenant: ${errorMessage}`);
      },
    });
  });

  const renderCreateTenantStep = () => {
    switch (stepIndex) {
      case 0:
        return <GeneralInfo control={control} register={register} />;
      case 1:
        return <GovernmentInfo control={control} />;
      case 2:
        return <OtherInfo register={register} />;

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
          <ContentCard sx={{ maxWidth: 'sm', gap: 4 }}>
            <Stack spacing={1}>
              <Typography variant="h5" fontWeight="bold" textAlign="start">
                Create Tenant
              </Typography>
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
                sx={{ textAlign: 'start', whiteSpace: 'pre-line' }}
              >
                {renderCreateTenantStepInfo()}
              </Typography>
            </Stack>

            {renderCreateTenantStep()}

            {(errors?.contact ||
              errors?.name ||
              errors?.email ||
              errors?.sss ||
              errors?.tin ||
              errors?.pagibig ||
              errors?.philhealth) && (
              <Box
                sx={{
                  textAlign: 'start',
                  border: '1px solid',
                  px: 1,
                  py: 0.5,
                  bgcolor: alpha(theme.palette.error.main, 0.2),
                  borderColor: 'error.light',
                }}
              >
                <Typography fontSize="small" color="error">
                  {errors.name?.message ||
                    errors.email?.message ||
                    errors.contact?.message ||
                    errors.tin?.message ||
                    errors.sss?.message ||
                    errors.pagibig?.message ||
                    errors.philhealth?.message}
                </Typography>
              </Box>
            )}

            <StepNavigation
              disabled={isLastStep && !isValid}
              nextLabel={isLastStep ? 'Create Tenant' : 'Next'}
              loading={isCreatingTenant}
              onNext={isLastStep ? onSubmit : nextStep}
              onPrevious={prevStep}
            />
          </ContentCard>
        )}
      </Container>
    </PageLayout>
  );
};
