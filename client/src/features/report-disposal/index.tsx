import { MoreHorizOutlined } from '@mui/icons-material';
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { CardContainer, NoData } from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { useGetReportByIdQuery } from '~/services/report/report.queries';
import { formatDate } from '~/utils/date';
import { formatCurrency, formatNumber } from '~/utils/number';
import { UpdateDisposalModal } from './UpdateDisposalModal';
import type { ReportDisposal as ReportDisposalType } from '~/services/report/report.types';

export const ReportDisposal = () => {
  const { auth } = useAuthContext();
  const { reportId } = useParams<{ reportId: string }>();
  const [selectedDisposal, setSelectedDisposal] = useState<ReportDisposalType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tenantId = auth?.tenantId || null;

  const { data: report, isLoading } = useGetReportByIdQuery({
    tenantId: tenantId!,
    reportId: reportId!,
  });

  const handleOpenModal = (disposal: ReportDisposalType) => {
    setSelectedDisposal(disposal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  // const isEditable =
  //   report.status === ReportStatus.DRAFT || report.status === ReportStatus.VALIDATED;
  // const isReadOnly = report.status === ReportStatus.SUBMITTED;

  const disposals = report.disposals || [];

  return (
    <Stack p={2} spacing={1}>
      <Typography
        width="fit-content"
        variant="body1"
        p={1}
        bgcolor="background.paper"
        borderRadius={2}
      >
        {formatDate(new Date(report.shiftDate), 'MMMM DD, YYYY')} — {report.shift.name} Shift
      </Typography>

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
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {disposal.product.name}
                </Typography>
                <MoreHorizOutlined
                  onClick={() => handleOpenModal(disposal)}
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Reading {`(after)`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(Number(disposal.afterReading), 2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Reading {`(before)`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatNumber(Number(disposal.beforeReading), 2)}
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
                    {formatNumber(Number(disposal.netDisposal), 2)}
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
      {selectedDisposal && (
        <UpdateDisposalModal
          open={isModalOpen}
          onClose={handleCloseModal}
          reportId={reportId!}
          disposal={selectedDisposal}
        />
      )}
    </Stack>
  );
};
