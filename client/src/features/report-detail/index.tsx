import { Stack, Typography, CircularProgress, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

import { CardContainer, NoData } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useGetReportByIdQuery } from '~/services/report/report.queries';
import { ReportStatus } from '~/services/report/report.types';
import { formatDate } from '~/utils/date';
import { formatCurrency } from '~/utils/number';

import { Shortcuts } from './Shortcuts';
import { EmployeesOnDuty } from './EmployeesOnDuty';
import { Income } from './Income';
import { Expenses } from './Expenses';
import { Lubricants } from './Lubricants';

export const ReportDetail = () => {
  const { auth } = useAuthContext();
  const { reportId } = useParams<{ reportId: string }>();

  const tenantId = auth?.tenantId || null;

  const { data: report, isLoading } = useGetReportByIdQuery({
    tenantId: tenantId!,
    reportId: reportId!,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return <NoData text="Report not found" />;
  }

  const isEditable =
    report.status === ReportStatus.DRAFT || report.status === ReportStatus.VALIDATED;
  const isReadOnly = report.status === ReportStatus.SUBMITTED;

  return (
    <Stack p={2} spacing={2}>
      <Stack spacing={1}>
        <Typography
          width="fit-content"
          variant="body1"
          p={1}
          bgcolor="background.surface"
          borderRadius={1}
        >
          {formatDate(new Date(), 'MMMM DD, YYYY')} — {report.shift.name} Shift
        </Typography>

        {/* Report Summary */}
        <CardContainer
          p={3}
          spacing={2}
          borderColor="primary.main"
          borderRadius={2}
          bgcolor="primary.main"
          height="fit-content"
        >
          <Stack>
            <Typography variant="body1" fontWeight={500} color="primary.alpha">
              Total Sales
            </Typography>
            <Typography variant="h2" fontWeight={600} color="common.white">
              {formatCurrency(report?.netTotal)}
            </Typography>
          </Stack>

          <Stack pl={2} spacing={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" color="primary.alpha">
                Sales
              </Typography>
              <Typography variant="body1" color="primary.alpha">
                {formatCurrency(report?.totalIncome)}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" color="primary.alpha">
                Expenses
              </Typography>
              <Typography variant="body1" color="primary.alpha">
                {formatCurrency(report?.totalExpenses)}
              </Typography>
            </Stack>
          </Stack>
        </CardContainer>
      </Stack>

      <Shortcuts />
      <EmployeesOnDuty />
      <Income
        reportId={reportId!}
        income={report.income}
        totalIncome={report.totalIncome}
        isReadOnly={isReadOnly}
      />
      <Expenses
        reportId={reportId!}
        expenses={report.expenses}
        totalExpenses={report.totalExpenses}
        isReadOnly={isReadOnly}
      />
      <Lubricants />

      {isEditable && (
        <Typography color="info" variant="body2">
          This report is {report.status.toLowerCase()} and can be edited.
        </Typography>
      )}

      {isReadOnly && (
        <Typography color="warning" variant="body2">
          This report has been submitted and cannot be edited.
        </Typography>
      )}
    </Stack>
  );
};
