import { Stack, Typography, CircularProgress, Box } from '@mui/material';

import { CardContainer } from '~/components/ui';
import { formatCurrency } from '~/utils/number';
import { useGetReportByIdQuery } from '~/services/report/report.queries';
import { ReportStatus } from '~/services/report/report.types';
import type { Shift } from '~/services/shift/shift.types';
import { formatDate } from '~/utils/date';

type ReportDetailProps = {
  reportId: string;
  tenantId: string;
  shift: Shift;
};

export const ReportDetail = ({ reportId, tenantId, shift }: ReportDetailProps) => {
  const { data: report, isLoading } = useGetReportByIdQuery({ tenantId, reportId });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!report) {
    return <Typography color="error">Report not found</Typography>;
  }

  const isEditable =
    report.status === ReportStatus.DRAFT || report.status === ReportStatus.VALIDATED;
  const isReadOnly = report.status === ReportStatus.SUBMITTED;

  return (
    <Stack spacing={1}>
      <Typography
        width="fit-content"
        variant="body2"
        border="1px solid"
        borderColor="divider"
        p={1}
        borderRadius={2}
      >
        {formatDate(new Date(), 'MMMM DD, YYYY')} — {shift.name} Shift
      </Typography>
      <CardContainer
        p={3}
        spacing={2}
        borderColor="primary.main"
        bgcolor="primary.main"
        height="fit-content"
      >
        <Stack>
          <Typography variant="body2" sx={{ color: 'divider' }}>
            Total Sales
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 600, color: 'common.white' }}>
            {formatCurrency(report?.netTotal)}
          </Typography>
        </Stack>

        <Stack pl={2} spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Sales
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {formatCurrency(report?.totalIncome)}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Expenses
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              {formatCurrency(report?.totalExpenses)}
            </Typography>
          </Stack>
        </Stack>
      </CardContainer>

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
