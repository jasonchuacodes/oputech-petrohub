import { Box, Stack, Typography } from '@mui/material';
import { Schedule, HomeOutlined, AddOutlined, GroupOutlined } from '@mui/icons-material';

import { PageHeader } from '~/components/layouts';
import {
  Breadcrumb,
  Button,
  CardContainer,
  LoadingSpinner,
  NoData,
  PageContainer,
  PageLayout,
  Show,
} from '~/components/ui';
import { ShiftProvider } from '~/context/shift';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { AdminRoutes } from '~/routes';
import { useGetShiftsQuery } from '~/services/shift/shift.queries';
import { useGetTenantUsersQuery } from '~/services/tenant/tenant.queries';
import { pathFor } from '~/utils/pathFor';

import { AddUserButton } from './AddUserToShiftModal';
import { CreateShiftModal } from './CreateShiftModal';
import { MoreDetailsMenu } from './MoreDetailsMenu';
import { ShiftUserCard } from './ShiftUserCard';
import { getShiftColorConfig } from './shiftColorMap';
import { UserRole } from '../../../services/user/user.types';

export const ShiftsPage = () => {
  const { tenantId } = useTenantContext();
  const disclosure = useDisclosure();

  const { data: shifts, isLoading } = useGetShiftsQuery(tenantId);
  const { data: users = [] } = useGetTenantUsersQuery({
    tenantId,
    filters: { role: UserRole.USER },
  });

  return (
    <PageLayout>
      <PageContainer>
        <Breadcrumb
          items={[
            {
              icon: HomeOutlined,
              label: 'Home',
              to: pathFor({
                pathname: AdminRoutes.TenantHome,
                params: { tenantId },
              }),
            },
            {
              label: 'Shifts',
            },
          ]}
        />
        <PageHeader
          title="Shift Schedules"
          description="Manage your employee shift schedules here. Assign start and end times."
          action={
            <Button
              onClick={disclosure.onOpen}
              variant="contained"
              size="large"
              startIcon={<AddOutlined fontSize="small" />}
            >
              Create Shift
            </Button>
          }
        />

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" pt={10}>
            <LoadingSpinner />
          </Box>
        ) : shifts && shifts.length > 0 ? (
          <Stack
            direction="row"
            spacing={2}
            alignItems="start"
            height="100%"
            sx={{
              maxHeight: {
                sm: '100%',
                md: '80%',
              },
              overflowY: 'auto',
            }}
          >
            {/* Unassigned column */}
            <Stack flex={1} minWidth={280} maxWidth={400} height="100%">
              <CardContainer
                spacing={2}
                sx={{
                  bgcolor: 'background.surface',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack spacing={1} direction="row">
                  <GroupOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Stack spacing={0.5}>
                    <Typography variant="body2" fontWeight="500" color="text.primary">
                      Unassigned{' '}
                      <Typography component="span" variant="caption" color="text.secondary">
                        ({users.filter((u) => !u.shiftSchedule).length})
                      </Typography>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Drag users to assign
                    </Typography>
                  </Stack>
                </Stack>
                <Show when={users.filter((u) => !u.shiftSchedule).length === 0}>
                  <NoData text="" description="All users are assigned to a shift" />
                </Show>
                <Stack spacing={0.5} flex={1} minHeight={0} overflow='auto'>
                  {users
                    .filter((u) => !u.shiftSchedule)
                    .map((user) => (
                      <ShiftUserCard key={user.id} user={user} onDrag={() => null} />
                    ))}
                </Stack>
              </CardContainer>
            </Stack>

            {/* Shift columns */}
            {shifts.map((shift) => {
              const shiftUsers = users.filter((u) => u.shiftSchedule?.shiftId === shift.id);
              const colorConfig = getShiftColorConfig(shift.color);

              return (
                <Stack key={shift.id} flex={1} minWidth={280} maxWidth={400} height="100%">
                  <ShiftProvider shift={shift}>
                    <CardContainer
                      spacing={2}
                      sx={{
                        justifyContent: 'space-between',
                        bgcolor: colorConfig.background,
                        border: '1px solid',
                        borderColor: colorConfig.light,
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="start">
                          <Stack spacing={1}>
                            <Typography variant="body1" fontWeight="500">
                              {shift.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                {new Date(shift.shiftStart).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}{' '}
                                —{' '}
                                {new Date(shift.shiftEnd).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </Typography>
                            </Stack>
                          </Stack>
                          <MoreDetailsMenu />
                        </Stack>

                        {/* TODO: implement drag and drop functionality
                        <Stack
                          border="2px dashed"
                          borderColor={colorConfig.light}
                          borderRadius={2}
                          bgcolor={colorConfig.background}
                          p={2}
                          alignItems="center"
                          justifyContent="center"
                          spacing={0.5}
                        >
                          <InboxOutlined sx={{ color: colorConfig.main }} />
                          <Typography variant="body2" fontWeight={500} color={colorConfig.main}>
                            Drop users here
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            or click to add
                          </Typography>
                        </Stack>
                        */}

                        <Stack spacing={0.5} flex={1} minHeight={0} overflow='auto'>
                          {shiftUsers.map((user) => (
                            <ShiftUserCard key={user.id} user={user} />
                          ))}
                        </Stack>
                        <Show when={shiftUsers.length === 0}>
                          <NoData text="" description="No users assigned to this shift" />
                        </Show>
                      </Stack>

                      <AddUserButton colorConfig={colorConfig} />
                    </CardContainer>
                  </ShiftProvider>
                </Stack>
              );
            })}
          </Stack>
        ) : (
          <Box pt={10}>
            <NoData text="No Shift schedule found." />
          </Box>
        )}
      </PageContainer>

      <CreateShiftModal open={disclosure.open} onClose={disclosure.onClose} />
    </PageLayout>
  );
};
