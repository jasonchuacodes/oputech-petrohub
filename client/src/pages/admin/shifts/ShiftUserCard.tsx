import { DragIndicatorOutlined, RemoveOutlined } from '@mui/icons-material';
import { Avatar, IconButton, Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { type User } from '~/services/user/user.types';
import { toTitleCase } from '~/utils/textUtils';
import { Show } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useUpdateUserMutation } from '~/services/user/user.queries';

interface ShiftUserCardProps {
  user: User;
  onDrag?: () => void;
}

export const ShiftUserCard = ({ user, onDrag }: ShiftUserCardProps) => {
  const { tenantId } = useTenantContext();
  const { mutateAsync: updateUser, isPending } = useUpdateUserMutation();

  const handleRemove = async () => {
    if (!user.shiftSchedule?.shiftId || !tenantId) return;
    try {
      await updateUser({
        userId: user.id,
        tenantId,
        data: { shiftId: null, name: user.name },
      });
      toast.success('User removed from shift');
    } catch {
      toast.error('Failed to remove user from shift');
    }
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Show when={!!onDrag}>
          <DragIndicatorOutlined fontSize="small" color="action" />
        </Show>
        <Avatar sx={{ width: 36, height: 36 }}>
          <Typography fontSize="small">{user.name.charAt(0).toUpperCase()}</Typography>
        </Avatar>
        <Stack spacing={0.5}>
          <Typography fontWeight={600} fontSize="small">
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {toTitleCase(user.position || 'Employee')}
          </Typography>
        </Stack>
      </Stack>
      <Show when={!!user.shiftSchedule?.shiftId}>
        <IconButton
          size="small"
          onClick={handleRemove}
          disabled={isPending || !user.shiftSchedule?.shiftId}
        >
          <RemoveOutlined fontSize="inherit" sx={{ color: 'text.secondary' }} />
        </IconButton>
      </Show>
    </Stack>
  );
};
