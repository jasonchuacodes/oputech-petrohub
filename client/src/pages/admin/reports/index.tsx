import { ChevronRightOutlined, HomeOutlined } from '@mui/icons-material';
import { Typography } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Breadcrumb,
  Chip,
  DataTable,
  PageContainer,
  PageLayout,
  type DateRange,
} from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { PageHeader } from '~/components/layouts';
import { AdminRoutes } from '~/routes';
import { pathFor } from '~/utils/pathFor';
import { formatDate, formatTime, getInitialDateRange } from '~/utils/date';
import { formatNumber } from '~/utils/number';
import { useGetReportsQuery } from '~/services/report/report.queries';
import { ReportStatus } from '~/services/report/report.types';

const REPORTS_KEY = 'reports';

export const ReportsPage = () => {
  const { tenantId } = useTenantContext();
  const navigate = useNavigate();

  const initialRange = getInitialDateRange(REPORTS_KEY);

  const [startDate, setStartDate] = useState<Dayjs | null>(initialRange.startDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialRange.endDate);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetReportsQuery({
    tenantId,
    filters: {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    },
    page,
  });

  const handleSelectDateRange = ({ start, end }: DateRange) => {
    const newStart = start?.startOf('day') ?? null;
    const newEnd = end?.endOf('day') ?? null;

    const hasChanged =
      (newStart && !newStart.isSame(startDate)) || (newEnd && !newEnd.isSame(endDate));

    if (hasChanged) {
      setStartDate(newStart);
      setEndDate(newEnd);
      setPage(1);
    }
  };

  const handleRowClick = (reportId: string) => {
    navigate(
      pathFor({
        pathname: AdminRoutes.TenantReportDetails,
        params: { tenantId, reportId },
      }),
    );
  };

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
              label: 'Reports',
            },
          ]}
        />
        <PageHeader title="Reports" description="View the list of reports here." />

        <DataTable
          id="reports-table"
          collection={DataTable.collection({
            items: data?.reports ?? [],
            itemToValue: (report) => report.id,
            itemToString: (report) => report.shiftDate,
          })}
          columns={[
            {
              id: 'shiftDate',
              heading: 'Date',
              cell: (report) => (
                <Typography variant="body2" color="text.primary">
                  {formatDate(report.shiftDate, 'MM/DD/YYYY')}
                </Typography>
              ),
              orderable: true,
              width: 100,
            },

            {
              id: 'shift',
              heading: 'Shift',
              cell: (report) => (
                <Chip
                  label={`${report.shift.name} ${report.status !== ReportStatus.SUBMITTED ? `(${report.status.toLowerCase()})` : ''}`}
                  color={report.status !== ReportStatus.SUBMITTED ? 'default' : report.shift.color}
                />
              ),
              width: 100,
            },
            {
              id: 'period',
              heading: 'Period',
              cell: (report) => (
                <Typography variant="body2" color="text.secondary">
                  {formatTime(report.periodStart)} - {formatTime(report.periodEnd)}
                </Typography>
              ),
              width: 140,
            },
            {
              id: 'netTotal',
              heading: 'Net Total',
              cell: (report) => (
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(report.netTotal)}
                </Typography>
              ),
              summary: (reports) => (
                <Typography variant="body2" color="text.primary">
                  {formatNumber(reports.reduce((sum, r) => sum + r.netTotal, 0))}
                </Typography>
              ),
              width: 120,
            },
            {
              id: 'totalSales',
              heading: 'Total Sales',
              cell: (report) => (
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(Number(report.totalIncome))}
                </Typography>
              ),
              summary: (reports) => (
                <Typography variant="body2" color="text.primary">
                  {formatNumber(reports.reduce((sum, r) => sum + Number(r.totalIncome), 0))}
                </Typography>
              ),
              width: 120,
            },
            {
              id: 'totalInventorySales',
              heading: 'Total Inventory Sales',
              cell: (report) => (
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(Number(report.totalInventorySales))}
                </Typography>
              ),
              summary: (reports) => (
                <Typography variant="body2" color="text.primary">
                  {formatNumber(reports.reduce((sum, r) => sum + Number(r.totalInventorySales), 0))}
                </Typography>
              ),
              width: 120,
            },
            {
              id: 'expenses',
              heading: 'Expenses',
              cell: (report) => (
                <Typography variant="body2" color="text.secondary">
                  {formatNumber(Number(report.totalExpenses))}
                </Typography>
              ),
              summary: (reports) => (
                <Typography variant="body2" color="text.primary ">
                  {formatNumber(reports.reduce((sum, r) => sum + Number(r.totalExpenses), 0))}
                </Typography>
              ),
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
          onRowClick={(report) => handleRowClick(report.id)}
          emptyMessage="No reports data available."
          dateRange={{
            enabled: true,
            label: 'Period',
            startValue: startDate,
            endValue: endDate,
            onRangeChange: handleSelectDateRange,
          }}
        />
      </PageContainer>
    </PageLayout>
  );
};
