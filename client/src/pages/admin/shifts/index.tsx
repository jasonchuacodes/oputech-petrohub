import { Box, Stack, Typography } from '@mui/material';
import { Schedule, HomeOutlined, AddOutlined } from '@mui/icons-material';

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
import { pathFor } from '~/utils/pathFor';

import { CreateShiftModal } from './CreateShiftModal';
import { MoreDetailsMenu } from './MoreDetailsMenu';

export const ShiftsPage = () => {
  const { tenantId } = useTenantContext();
  const disclosure = useDisclosure();

  const { data: shifts, isLoading } = useGetShiftsQuery(tenantId);

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
          title="Shift Management"
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
          <Stack spacing={1}>
            {shifts.map((shift) => (
              <ShiftProvider key={shift.id} shift={shift}>
                <CardContainer maxWidth={400}>
                  <Stack direction="row" justifyContent="space-between" alignItems="start">
                    <Stack spacing={1}>
                      <Typography variant="h6" fontWeight={600}>{shift.name}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Schedule fontSize="small" color="action" />
                        <Typography variant="body2" color="text.primary">
                          {new Date(shift.shiftStart).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                          -{' '}
                          {new Date(shift.shiftEnd).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {`(${shift._count?.users || 0} users assigned)`}
                      </Typography>
                    </Stack>

                    <MoreDetailsMenu />
                  </Stack>
                </CardContainer>
              </ShiftProvider>
            ))}
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
