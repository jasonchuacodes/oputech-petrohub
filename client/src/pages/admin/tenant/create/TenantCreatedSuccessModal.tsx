import { Stack, Typography } from '@mui/material';

import { CustomModal } from '~/components/ui';

type TenantCreatedSuccessModalProps = {
  open: boolean;
  tenantName: string;
  onClose: () => void;
  onNavigateToTenant: () => void;
};

export const TenantCreatedSuccessModal = ({
  open,
  tenantName,
  onClose,
  onNavigateToTenant,
}: TenantCreatedSuccessModalProps) => {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      onCancel={onClose}
      onSubmit={onNavigateToTenant}
      title="Tenant Created Successfully"
      submitText="Go to Tenant"
      cancelText="Create Another"
      maxWidth={520}
    >
      <Stack spacing={2}>
        <Typography variant="body2">
          <strong>{tenantName}</strong> has been created successfully.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Would you like to navigate to the new tenant or create another one?
        </Typography>
      </Stack>
    </CustomModal>
  );
};
