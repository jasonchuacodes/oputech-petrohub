import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonGroup,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import { useState } from 'react';

import { Button, CardContainer, LoadingSpinner, NoData, Show, Widget } from '~/components/ui';
import { useTenantContext } from '~/context/tenant/useTenantContext';
import { AdminRoutes } from '~/routes';
import { getProductTypeDisplayName } from '~/pages/admin/products/utils';
import { useGetReportsQuery } from '~/services/report/report.queries';
import { ReportStatus } from '~/services/report/report.types';
import { formatCurrency, formatNumber } from '~/utils/number';
import { pathFor } from '~/utils/pathFor';
import { InfoOutlineRounded } from '@mui/icons-material';

export const ReportSection = () => {
  const { tenantId } = useTenantContext();
  const [day, setDay] = useState<'yesterday' | 'today'>('today');

  const navigateTo = pathFor({
    pathname: AdminRoutes.TenantReports,
    params: { tenantId },
  });

  const shiftDate =
    day === 'today'
      ? dayjs().startOf('day').toISOString()
      : dayjs().subtract(1, 'day').startOf('day').toISOString();

  const { data, isLoading } = useGetReportsQuery({
    tenantId,
    filters: {
      status: ReportStatus.SUBMITTED,
      shiftDate,
    },
  });

  const reports = data?.reports ?? [];

  const disposalsByType = reports
    .flatMap((r) => r.disposals)
    .reduce<Record<string, number>>((acc, d) => {
      const key = d.product.type ?? 'OTHER';
      acc[key] = (acc[key] ?? 0) + Number(d.netDisposal);
      return acc;
    }, {});

  return (
    <Widget title="Reports" to={navigateTo}>
      <Stack p={2} spacing={1.5} height="100%" minHeight={0}>
        <ButtonGroup size="small" fullWidth>
          <Button
            fullWidth
            size="small"
            variant={day === 'yesterday' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setDay('yesterday')}
            sx={{ flexShrink: 1 }}
          >
            Yesterday
          </Button>
          <Button
            fullWidth
            size="small"
            variant={day === 'today' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setDay('today')}
            sx={{ flexShrink: 1 }}
          >
            Today
          </Button>
        </ButtonGroup>
        <Show when={!isLoading} fallback={<LoadingSpinner />}>
          <Show
            when={reports.length > 0}
            fallback={
              <NoData
                text="No reports available"
                description={`No reports were submitted ${day} • ${dayjs(shiftDate).format('MMMM D, YYYY')}.`}
              />
            }
          >
            <Stack spacing={1} pt={1} flex={1} minHeight={0} overflow="auto">
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  width={28}
                  height={28}
                  borderRadius="50%"
                  bgcolor="primary.alpha"
                >
                  <InfoOutlineRounded sx={{ color: 'primary.light' }} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {`Reports generated ${day === 'today' ? 'today' : 'yesterday'} • ${dayjs(shiftDate).format('MMMM D, YYYY')}`}
                </Typography>
              </Stack>
              <Show when={Object.keys(disposalsByType).length > 0}>
                <Stack
                  bgcolor={(theme) => alpha(theme.palette.primary.main, 0.08)}
                  borderRadius={2}
                  p={1.5}
                  spacing={1}
                  mb={1}
                >
                  <Typography variant="body2" fontWeight={500}>
                    Disposal Summary
                  </Typography>
                  <Divider />
                  {Object.entries(disposalsByType).map(([type, net]) => (
                    <Stack key={type} direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {getProductTypeDisplayName(
                          type as Parameters<typeof getProductTypeDisplayName>[0],
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatNumber(net, 3)} L
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Show>

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
                    <CardContainer height="fit-content" p={3} spacing={1} borderRadius={0}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body1" fontWeight={500} color="text.primary">
                          Net Sales
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="primary.main">
                          {formatCurrency(Number(report.netTotal))}
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
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Fuel Sales
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(Number(report.totalSales))}
                        </Typography>
                      </Stack>
                      <Divider sx={{ borderColor: 'divider' }} />

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

                        <Divider />
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
                          color={(report.shortages ?? 0) > 0 ? 'error.main' : 'warning.main'}
                        >
                          {(report.shortages ?? 0) > 0
                            ? `(${formatNumber(Math.abs(report.shortages ?? 0))})`
                            : formatNumber(Math.abs(report.shortages ?? 0))}
                        </Typography>
                      </Stack>
                    </CardContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Show>
        </Show>
      </Stack>
    </Widget>
  );
};
