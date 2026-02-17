import { ChevronRightOutlined, HomeOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '~/components/layouts';
import { Breadcrumb, DataTable, PageContainer, PageLayout, type DateRange } from '~/components/ui';
import { TimesheetProvider, useTimesheetContext } from '~/context/timesheet';
import { useGetAllTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import type { Timesheet } from '~/services/timesheet/timesheet.types';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';
import { formatNumber } from '~/utils/number';

import { TimesheetLogs } from './timesheet-logs';

dayjs.extend(weekday);
dayjs.extend(utc);

type GroupedTimesheet = {
  userId: string;
  userName: string;
  totalHours: number;
};

const TimesheetsPageContent = () => {
  const { tenantId, userId } = useParams();
  const navigate = useNavigate();
  const { startDate, endDate, setStartDate, setEndDate } = useTimesheetContext();

  const { data: timesheets, isLoading } = useGetAllTimesheetsQuery({
    tenantId,
    startDate,
    endDate,
  });

  const groupedTimesheets = timesheets?.reduce<Record<string, GroupedTimesheet>>(
    (acc, timesheet: Timesheet) => {
      const key = timesheet.user.id;

      if (!acc[key]) {
        acc[key] = {
          userId: timesheet.user.id,
          userName: timesheet.user.name,
          totalHours: 0,
        };
      }

      acc[key].totalHours += timesheet.totalHours;

      return acc;
    },
    {},
  );

  return (
    <PageLayout>
      {userId ? (
        <TimesheetLogs />
      ) : (
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
                label: 'Timesheets',
              },
            ]}
          />
          <PageHeader
            title="Timesheets"
            description="View and manage timesheet records for your team"
          />

          <DataTable
            id="timesheets-table"
            collection={DataTable.collection({
              items: Object.values(groupedTimesheets ?? {}) || [],
              itemToValue: (item) => item.userId,
              itemToString: (item) => item.userName,
            })}
            columns={[
              {
                id: 'userName',
                heading: 'Name',
                cell: (item) => (
                  <Typography variant="body2" color="text.primary">
                    {item.userName}
                  </Typography>
                ),
                orderable: true,
                width: 240,
              },
              {
                id: 'totalHours',
                heading: 'Total Hours',
                cell: (item) => (
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(item.totalHours, 2)} hrs
                  </Typography>
                ),
                orderable: true,
                width: 120,
              },
              {
                id: 'actions',
                heading: '',
                align: 'right',
                cell: () => (
                  <ChevronRightOutlined
                    fontSize="small"
                    sx={{
                      color: 'text.secondary',
                      opacity: 0.6,
                    }}
                  />
                ),
              },
            ]}
            loading={isLoading}
            onRowClick={(item) =>
              navigate(
                pathFor({
                  pathname: AdminRoutes.TenantTimesheets,
                  params: { tenantId, userId: item.userId },
                }),
              )
            }
            emptyMessage="No timesheets data available."
            search={{
              enabled: true,
              placeholder: 'Search employee',
            }}
            dateRange={{
              enabled: true,
              startValue: startDate,
              endValue: endDate,
              onRangeChange: ({ start, end }: DateRange) => {
                const newStart = start?.startOf('day') ?? null;
                const newEnd = end?.endOf('day') ?? null;

                const hasChanged =
                  (newStart && !newStart.isSame(startDate)) || (newEnd && !newEnd.isSame(endDate));

                if (hasChanged) {
                  setStartDate(newStart);
                  setEndDate(newEnd);
                }
              },
            }}
          />
        </PageContainer>
      )}
    </PageLayout>
  );
};

export const TimesheetsPage = () => {
  return (
    <TimesheetProvider>
      <TimesheetsPageContent />
    </TimesheetProvider>
  );
};
