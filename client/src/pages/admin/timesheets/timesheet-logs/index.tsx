import { HomeOutlined } from '@mui/icons-material';
import { Stack, Tooltip, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { PageHeader } from '~/components/layouts';
import { Breadcrumb, DataTable, PageContainer, type DateRange } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { useTimesheetContext } from '~/context/timesheet/useTimesheetContext';
import { TimesheetLogProvider } from '~/context/timesheetLog';
import { AdminRoutes } from '~/routes';
import { useGetUserQuery } from '~/services/user/user.queries';
import { useGetUserTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import { TimesheetEntryActionEnum } from '~/services/timesheet/timesheet.types';
import { formatDate, formatTime } from '~/utils/date';
import { pathFor } from '~/utils/pathFor';

import { UserHeader } from './UserHeader';
import { TimesheetActions } from './TimesheetActions';

export const TimesheetLogs = () => {
  const { userId } = useParams();
  const { tenantId } = useTenantContext();
  const { startDate, endDate, setStartDate, setEndDate } = useTimesheetContext();

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery({
    userId,
  });

  const { data: timesheetLogs, isLoading } = useGetUserTimesheetsQuery({
    tenantId,
    userId,
    startDate,
    endDate,
  });

  const handleSelectDateRange = ({ start, end }: DateRange) => {
    const newStart = start?.startOf('day') ?? null;
    const newEnd = end?.endOf('day') ?? null;

    const hasChanged =
      (newStart && !newStart.isSame(startDate)) || (newEnd && !newEnd.isSame(endDate));

    if (hasChanged) {
      setStartDate(newStart);
      setEndDate(newEnd);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <PageContainer maxWidth="lg" stackSx={{ justifyContent: 'start', alignItems: 'stretch' }}>
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
            label: 'Timesheets',
            to: pathFor({
              pathname: AdminRoutes.TenantTimesheets,
              params: { tenantId },
            }),
          },
          {
            label: 'Timesheet Logs',
          },
        ]}
      />
      <PageHeader
        title="Timesheet Logs"
        description="View and manage detailed timesheet entries and check-in/check-out records"
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <UserHeader user={user} isLoading={isLoadingUser} />
      </Stack>

      <DataTable
        id="timesheet-logs-table"
        collection={DataTable.collection({
          items: timesheetLogs ?? [],
          itemToValue: (timesheet) => timesheet.id,
          itemToString: (timesheet) => `Timesheet for ${timesheet.createdAt}`,
        })}
        dateRange={{
          enabled: true,
          startValue: startDate,
          endValue: endDate,
          onRangeChange: handleSelectDateRange,
        }}
        onExport={() => null}
        columns={[
          {
            id: 'date',
            heading: 'Date',
            orderable: true,
            width: 240,
            cell: (timesheet) => (
              <Typography variant="body2">{formatDate(timesheet.createdAt)}</Typography>
            ),
          },
          {
            id: 'checkIn',
            heading: 'Check In',
            cell: (timesheet) => {
              const firstCheckIn = timesheet.entries.find(
                (e) => e.action === TimesheetEntryActionEnum.CHECK_IN,
              );
              return (
                <Tooltip title="First In">
                  <Typography variant="body2" color="text.secondary">
                    {firstCheckIn ? formatTime(firstCheckIn.timestamp) : '—'}
                  </Typography>
                </Tooltip>
              );
            },
          },
          {
            id: 'checkOut',
            heading: 'Check Out',
            cell: (timesheet) => {
              const lastCheckOut = [...timesheet.entries]
                .reverse()
                .find((e) => e.action === TimesheetEntryActionEnum.CHECK_OUT);
              return (
                <Tooltip title="Last Out">
                  <Typography variant="body2" color="text.secondary">
                    {lastCheckOut ? formatTime(lastCheckOut.timestamp) : '—'}
                  </Typography>
                </Tooltip>
              );
            },
          },
          {
            id: 'totalHours',
            heading: 'Total Hours',
            orderable: true,
            width: 256,
            cell: (timesheet) => (
              <Typography
                variant="body2"
                color="text.secondary"
              >{`${timesheet.totalHours.toFixed(2)} hrs`}</Typography>
            ),
          },
          {
            id: 'actions',
            heading: '',
            align: 'right',
            width: 120,
            cell: (timesheet) => (
              <TimesheetLogProvider timesheetLog={timesheet}>
                <TimesheetActions />
              </TimesheetLogProvider>
            ),
          },
        ]}
        loading={isLoading}
        emptyMessage="No timesheets data available."
      />
    </PageContainer>
  );
};
