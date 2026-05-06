import { WarningAmberOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { CustomModal } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useRebuildAggregationsMutation } from '~/services/analytics/analytics.queries';

type RebuildConfirmModalProps = {
  open: boolean;
  onClose: () => void;
};

export const RebuildConfirmModal = ({ open, onClose }: RebuildConfirmModalProps) => {
  const { tenantId } = useTenantContext();
  const { mutateAsync: rebuild, isPending } = useRebuildAggregationsMutation();

  const handleConfirm = async () => {
    if (!tenantId) return;

    try {
      const result = await rebuild(tenantId);
      toast.success(
        result.status === 'skipped'
          ? 'Analytics data is already in sync — no rebuild needed.'
          : 'Aggregation data rebuilt successfully.'
      );
      onClose();
    } catch {
      toast.error('Rebuild failed. Please try again.');
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      onSubmit={handleConfirm}
      type="danger"
      title="Rebuild Aggregation Data"
      icon={WarningAmberOutlined}
      subheader={
        <Stack spacing={1}>
          <Typography variant="body2">
            This will delete and recompute all analytics aggregations for this tenant.
          </Typography>
          <Typography variant="body2">
            Only use this if analytics appear incorrect. If data is already in sync, no changes will be made.
          </Typography>
        </Stack>
      }
      submitText="Rebuild"
      loading={isPending}
    />
  );
};
