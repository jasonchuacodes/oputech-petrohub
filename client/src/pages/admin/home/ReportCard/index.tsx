import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';

import { CardContainer, LoadingSpinner, NoData, Show, Widget } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { useGetReportsQuery } from '~/services/report/report.queries';
import { ReportStatus } from '~/services/report/report.types';
import { formatCurrency, formatNumber } from '~/utils/number';
import { pathFor } from '~/utils/pathFor';

export const ReportCard = () => {
  const { tenantId } = useTenantContext();

  const navigateTo = pathFor({
    pathname: AdminRoutes.TenantReports,
    params: { tenantId },
  });

  const { data: reports = [], isLoading } = useGetReportsQuery({
    tenantId,
    filters: {
      status: ReportStatus.SUBMITTED,
      shiftDate: dayjs().startOf('day').toISOString(),
    },
  });

  return (
    <Widget title="Daily Report" to={navigateTo}>
      <Stack p={2} spacing={0.5}>
        <Show when={!isLoading} fallback={<LoadingSpinner />}>
          <Show
            when={reports.length > 0}
            fallback={
              <Box pt={10}>
                <NoData text="No reports available" description="No reports have been submitted yet today. Please check again later." />
              </Box>
            }
          >
            <Stack spacing={0} mt={2}>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Reports generated today - {dayjs().format('MMMM D, YYYY')}
              </Typography>
              <Box
                sx={{
                  overflowY: 'auto',
                  maxHeight: 400,
                  pr: 1,
                }}
              >
                {reports.map((report, index) => (
                  <Accordion
                    defaultExpanded={index === 0}
                    key={report.id}
                    disableGutters
                    elevation={0}
                    sx={{
                      mb: index < reports.length - 1 ? 1 : 0,
                      '&::before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&.Mui-expanded': {
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {report.shift.name} Shift{' '}
                        <Typography variant="body1" component="span" color="warning">
                          ({dayjs(report.periodStart).format('h:mm A')} -{' '}
                          {dayjs(report.periodEnd).format('h:mm A')})
                        </Typography>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        borderLeft: '1px solid',
                        borderRight: '1px solid',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '0 0 8px 8px',
                        p: 0,
                        overflow: 'hidden',
                      }}
                    >
                      <CardContainer height="fit-content" p={2} spacing={2} borderRadius={0}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body1" fontWeight={500} color="text.primary">
                            Net Sales
                          </Typography>
                          <Typography variant="h5" fontWeight={600} color="primary.main">
                            {formatCurrency(Number(report.netTotal))}
                          </Typography>
                        </Stack>

                        <Stack pl={2} spacing={1}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Sales
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(Number(report.totalIncome))}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Expenses
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(Number(report.totalExpenses))}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Lubricants
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(Number(report.totalInventorySales))}
                            </Typography>
                          </Stack>

                          <Divider />

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.primary">
                              Total Sales
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              {formatCurrency(Number(report.totalSales))}
                            </Typography>
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Disposals Sales
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(Number(report.totalDisposalSales))}
                            </Typography>
                          </Stack>

                          <Divider />

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.primary">
                              {(report.shortages ?? 0) >= 0 ? 'Shortages' : 'Over'}
                            </Typography>
                            <Typography
                              variant="body2"
                              color={(report.shortages ?? 0) > 0 ? 'warning.main' : 'text.primary'}
                            >
                              {(report.shortages ?? 0) > 0
                                ? `(${formatNumber(Math.abs(report.shortages ?? 0))})`
                                : formatNumber(Math.abs(report.shortages ?? 0))}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Stack>
          </Show>
        </Show>
      </Stack>
    </Widget>
  );
};
