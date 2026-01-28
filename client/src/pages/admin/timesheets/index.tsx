import { ChevronRightOutlined, HomeOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '~/components/layouts';
import {
  Breadcrumb,
  DataTable,
  PageContainer,
  PageLayout,
  type DateRange,
} from '~/components/ui';
import { useGetAllTimesheetsQuery } from '~/services/timesheet/timesheet.queries';
import type { Timesheet } from '~/services/timesheet/timesheet.types';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';
import { getInitialDateRange } from '~/utils/date';

import { TimesheetLogs } from './timesheet-logs';

dayjs.extend(weekday);
dayjs.extend(utc);

const TIMESHEETS_KEY = 'timesheets';

type GroupedTimesheet = {
  userId: string;
  userName: string;
  totalHours: number;
};

const TimesheetsPageContent = () => {
  const { tenantId, userId } = useParams();
  const navigate = useNavigate();

  const initialRange = getInitialDateRange(TIMESHEETS_KEY);

  const [startDate, setStartDate] = useState<Dayjs | null>(initialRange.startDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialRange.endDate);

  const { data: timesheets, isLoading } = useGetAllTimesheetsQuery({
    tenantId,
    startDate,
    endDate,
  });

  // Group timesheets by user
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

  const groupedData = Object.values(groupedTimesheets ?? {});

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

  const handleRowClick = (userId: string) => {
    navigate(
      pathFor({
        pathname: AdminRoutes.TenantTimesheets,
        params: { tenantId, userId },
      }),
    );
  };

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
              items: groupedData || [],
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
                    {item.totalHours}
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
                width: 50,
              },
            ]}
            loading={isLoading}
            onRowClick={(item) => handleRowClick(item.userId)}
            emptyMessage="No timesheets data available."
            search={{
              enabled: true,
              placeholder: 'Search employee',
            }}
            dateRange={{
              enabled: true,
              startValue: startDate,
              endValue: endDate,
              onRangeChange: handleSelectDateRange,
            }}
          />
        </PageContainer>
      )}
    </PageLayout>
  );
};

export const TimesheetsPage = TimesheetsPageContent;
