import { useState } from 'react';
import { AddOutlined, GroupAddOutlined } from '@mui/icons-material';
import { Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import toast from 'react-hot-toast';

import { Button, CustomModal } from '~/components/ui';
import { useShiftContext } from '~/context/shift';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { useGetTenantUsersQuery } from '~/services/tenant/tenant.queries';
import { useUpdateUserMutation } from '~/services/user/user.queries';

interface ShiftColorConfig {
  main: string;
  light: string;
  background: string;
  surface: string;
}

interface AddUserButtonProps {
  colorConfig: ShiftColorConfig;
}

export const AddUserButton = ({ colorConfig }: AddUserButtonProps) => {
  const { shift } = useShiftContext();
  const { tenantId } = useTenantContext();
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { data: allUsers = [] } = useGetTenantUsersQuery({
    tenantId,
    filters: { role: 'USER' },
  });
  const { mutateAsync: updateUser, isPending } = useUpdateUserMutation();

  const availableUsers = allUsers.filter((u) => !u.shiftSchedule?.shiftId); 

  const handleToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );
  };

  const handleClose = () => {
    setSelectedUserIds([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (selectedUserIds.length === 0 || !tenantId) return;
    try {
      await Promise.all(
        selectedUserIds.map((userId) => {
          const user = allUsers.find((u) => u.id === userId)!;
          return updateUser({
            userId,
            tenantId,
            data: { shiftId: shift.id, name: user.name },
          });
        }),
      );
      toast.success(
        selectedUserIds.length === 1
          ? 'User assigned to shift'
          : `${selectedUserIds.length} users assigned to shift`,
      );
      handleClose();
    } catch {
      toast.error('Failed to assign user(s) to shift');
    }
  };

  return (
    <>
      <Button
        startIcon={<AddOutlined fontSize="small" />}
        variant="contained"
        size="small"
        fullWidth
        onClick={onOpen}
        sx={{
          bgcolor: colorConfig.surface,
          color: colorConfig.main,
          border: '1px solid',
          borderColor: colorConfig.light,
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          Add User
        </Typography>
      </Button>

      <CustomModal
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        title="Add Users to Shift"
        subheader={
          <Typography variant="body2" fontWeight="medium" color="text.secondary">
            Assign employees to the{' '}
            <Typography variant="body2" component="span" color="warning">
              {shift.name}
            </Typography>{' '}
            shift.
          </Typography>
        }
        submitText="Assign"
        loading={isPending}
        disabled={selectedUserIds.length === 0}
        maxWidth={480}
        icon={GroupAddOutlined}
      >
        {availableUsers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            All users are already assigned to a shift schedule.
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Select users to assign to this shift:
            </Typography>
            <FormGroup>
              {availableUsers.map((user) => (
                <FormControlLabel
                  key={user.id}
                  label={<Typography variant="body2" color='text.primary'>{user.name}</Typography>}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleToggle(user.id)}
                    />
                  }
                />
              ))}
            </FormGroup>
          </Stack>
        )}
      </CustomModal>
    </>
  );
};
