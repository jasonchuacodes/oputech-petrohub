import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { Stack, Typography, Avatar, IconButton } from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { CardContainer, CustomModal, Show } from '~/components/ui';
import { MultiSelect } from '~/components/form';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { useGetTenantUsersQuery } from '~/services/tenant/tenant.queries';
import {
  useAssignEmployeeMutation,
  useRemoveEmployeeMutation,
} from '~/services/report/report.queries';
import { UserRole } from '~/services/user/user.types';

type EmployeesOnDutyProps = {
  reportId: string;
  employees: Array<{ user: { id: string; name: string; username: string } }>;
  isReadOnly: boolean;
};

export const EmployeesOnDuty = ({ reportId, employees, isReadOnly }: EmployeesOnDutyProps) => {
  const modalDisclosure = useDisclosure();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { auth } = useAuthContext();
  const tenantId = auth?.tenantId || null;

  const { data: tenantUsers = [] } = useGetTenantUsersQuery({ tenantId: tenantId! });
  const { mutateAsync: assignEmployee, isPending: isAssigning } = useAssignEmployeeMutation();
  const { mutateAsync: removeEmployee } = useRemoveEmployeeMutation();

  const availableUsers = tenantUsers.filter(
    (user) => user.role === UserRole.USER && !employees.some((emp) => emp.user.id === user.id),
  );

  const userOptions = availableUsers.map((user) => ({
    label: user.name,
    value: user.id,
  }));

  const handleAssign = async () => {
    try {
      await Promise.all(selectedUserIds.map((userId) => assignEmployee({ reportId, userId })));
      toast.success('Employees assigned');
      setSelectedUserIds([]);
      modalDisclosure.onClose();
    } catch {
      toast.error('Failed to assign employees');
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeEmployee({ reportId, userId });
      toast.success('Employee removed');
    } catch {
      toast.error('Failed to remove employee');
    }
  };

  return (
    <Stack spacing={0.5}>
      <Typography variant="body1" fontWeight={600} color="text.primary">
        On Duty
      </Typography>

      <CardContainer height="fit-content">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          flexWrap="wrap"
        >
          <Stack direction="row" alignItems="center" spacing={3} flex={1} overflow="auto">
            {employees.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No employees assigned
              </Typography>
            ) : (
              employees.map((emp) => (
                <Stack key={emp.user.id} position="relative" alignItems="center" spacing={1}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <Typography>{emp.user.name.charAt(0).toUpperCase()}</Typography>
                  </Avatar>
                  <Typography variant="body2">{emp.user.name.split(' ')[0]}</Typography>
                  <RemoveCircle
                    onClick={() => handleRemove(emp.user.id)}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      transform: 'translateY(-40%) translateX(50%)',
                      color: 'error.main',
                    }}
                  />
                </Stack>
              ))
            )}
          </Stack>
          <Show when={!isReadOnly && userOptions.length > 0}>
            <IconButton
              size="large"
              onClick={modalDisclosure.onOpen}
              sx={{
                color: 'primary.main',
                bgcolor: 'primary.alpha',
                '&:hover': { bgcolor: 'primary.alpha' },
                '&:active': { bgcolor: 'primary.alpha' },
              }}
            >
              <AddCircle fontSize="medium" />
            </IconButton>
          </Show>
        </Stack>

        <CustomModal
          open={modalDisclosure.open}
          onClose={modalDisclosure.onClose}
          title="Assign Employees"
          subheader="Select employees who were on duty during this shift"
          onSubmit={handleAssign}
          loading={isAssigning}
          submitText="Assign"
          icon={AddCircle}
        >
          <MultiSelect
            name="employees"
            options={userOptions}
            selected={selectedUserIds}
            onChange={(e) => setSelectedUserIds(e.target.value as string[])}
            label="Employees"
            placeholder="Select employees"
          />
        </CustomModal>
      </CardContainer>
    </Stack>
  );
};
