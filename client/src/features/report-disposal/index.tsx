import { CircleOutlined, EditOutlined } from '@mui/icons-material';
import { Box, CircularProgress, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { CardContainer, NoData, Show, Button } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useDisclosure } from '~/hooks/useDisclosure';
import { useGetReportByIdQuery } from '~/services/report/report.queries';
import { formatDate, formatTime } from '~/utils/date';
import { formatCurrency, formatNumber } from '~/utils/number';
import type { ReportDisposal as ReportDisposalType } from '~/services/report/report.types';
import { ReportStatus } from '~/services/report/report.types';

import { UpdateDisposalModal } from './UpdateDisposalModal';

export const ReportDisposal = () => {
  const { auth } = useAuthContext();
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [selectedDisposal, setSelectedDisposal] = useState<ReportDisposalType | null>(null);
  const { open, onOpen, onClose } = useDisclosure();

  const tenantId = auth?.tenantId || null;

  const { data: report, isLoading } = useGetReportByIdQuery({
    tenantId: tenantId!,
    reportId: reportId!,
  });

  const handleOpenModal = (disposal: ReportDisposalType) => {
    setSelectedDisposal(disposal);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setSelectedDisposal(null);
  };

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

  const disposals = report.disposals || [];
  const isOwner = auth?.id === report.creatorId;
  const isReadOnly = report.status === ReportStatus.SUBMITTED || !isOwner;

  return (
    <Stack p={2} spacing={1}>
      <Stack spacing={0.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
          <Typography variant="body1" color="text.primary" fontWeight={500}>
            {formatDate(new Date(), 'MMMM DD, YYYY')}
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          {report.shift.name} Shift ({formatTime(report.periodStart)} -{' '}
          {formatTime(report.periodEnd)})
        </Typography>
      </Stack>

      {disposals.length === 0 ? (
        <NoData
          text="No products found"
          description="There were no products found. Please contact your administrator and setup the products."
        />
      ) : (
        disposals.map((disposal) => (
          <CardContainer height="fit-content" spacing={2} key={disposal.id}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <CircleOutlined
                    color={disposal.product.color === 'grey' ? undefined : disposal.product.color}
                    sx={disposal.product.color === 'grey' ? { color: '#9E9E9E' } : undefined}
                  />
                  <Typography variant="body1" color="text.primary" fontWeight={600}>
                    {disposal.product.name}
                  </Typography>
                </Stack>

                <Show when={!isReadOnly}>
                  <IconButton size="small" onClick={() => handleOpenModal(disposal)}>
                    <EditOutlined />
                  </IconButton>
                </Show>
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Reading {`(after)`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(Number(disposal.afterReading), 3)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Reading {`(before)`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(Number(disposal.beforeReading), 3)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Calibrate
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(Number(disposal.calibrate), 3)}
                  </Typography>
                </Stack>

                <Divider />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography variant="body2" color="text.secondary">
                    Net Disposal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(Number(disposal.netDisposal), 3)}
                  </Typography>
                </Stack>

                {/* Effective Price based on shiftStart time */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(Number(disposal.priceSnapshot))}
                  </Typography>
                </Stack>

                <Divider />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Sales</Typography>
                  <Typography variant="body2">
                    {formatCurrency(Number(disposal.totalSales))}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </CardContainer>
        ))
      )}

      <Show when={!isReadOnly}>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            sessionStorage.setItem(`disposalsConfirmed:${reportId}`, 'true');
            toast.success('Readings confirmed');
            navigate(-1);
          }}
        >
          Confirm Readings
        </Button>
      </Show>

      <Show when={!!selectedDisposal}>
        <UpdateDisposalModal
          open={open}
          onClose={handleCloseModal}
          reportId={reportId!}
          disposal={selectedDisposal!}
        />
      </Show>
    </Stack>
  );
};
