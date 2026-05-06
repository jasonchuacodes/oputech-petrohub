import { Box, Divider, Stack, Typography } from '@mui/material';
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
} from '~/components/ui';
import { ShiftProvider } from '~/context/shift';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { AdminRoutes } from '~/routes';
import { useGetShiftsQuery } from '~/services/shift/shift.queries';
import { useGetTenantUsersQuery } from '~/services/tenant/tenant.queries';
import { pathFor } from '~/utils/pathFor';

import { CreateShiftModal } from './CreateShiftModal';
import { MoreDetailsMenu } from './MoreDetailsMenu';
import { ShiftUserCard } from './ShiftUserCard';
import { getShiftColorConfig } from './shiftColorMap';

export const ShiftsPage = () => {
  const { tenantId } = useTenantContext();
  const disclosure = useDisclosure();

  const { data: shifts, isLoading } = useGetShiftsQuery(tenantId);
  const { data: users = [] } = useGetTenantUsersQuery({ tenantId });

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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
            {/* Unassigned column */}
            <Box sx={{ flex: 1, maxWidth: 400 }}>
              <CardContainer spacing={2} sx={{ bgcolor: 'grey.50' }}>
                <Stack spacing={0.5}>
                  <Stack spacing={0.5} direction="row" alignItems="center">
                    <GroupOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1" fontWeight="500" color="text.secondary">
                      Unassigned
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    {`(${users.filter((u) => !u.shiftSchedule).length} unassigned)`}
                  </Typography>
                </Stack>

                <Divider />

                <Stack spacing={1}>
                  {users
                    .filter((u) => !u.shiftSchedule)
                    .map((user) => (
                      <ShiftUserCard key={user.id} user={user} />
                    ))}
                </Stack>

                <Button
                  startIcon={<AddOutlined fontSize="small" />}
                  variant="outlined"
                  size="small"
                  fullWidth
                >
                  Add User
                </Button>
              </CardContainer>
            </Box>

            {/* Shift columns */}
            {shifts.map((shift) => {
              const shiftUsers = users.filter((u) => u.shiftSchedule?.shiftId === shift.id);
              const colorConfig = getShiftColorConfig(shift.color);

              return (
                <Box key={shift.id} sx={{ flex: 1, maxWidth: 400 }}>
                  <ShiftProvider shift={shift}>
                    <CardContainer
                      spacing={2}
                      sx={{
                        bgcolor: colorConfig.background,
                        border: '1px solid',
                        borderColor: colorConfig.light,
                      }}
                    >
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

                      <Stack spacing={0.5}>
                        {shiftUsers.map((user) => (
                          <ShiftUserCard key={user.id} user={user} />
                        ))}
                      </Stack>

                      <Button
                        startIcon={<AddOutlined fontSize="small" />}
                        variant="contained"
                        size="small"
                        fullWidth
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
                    </CardContainer>
                  </ShiftProvider>
                </Box>
              );
            })}
          </Box>
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
