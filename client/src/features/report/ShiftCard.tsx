import { CheckCircleOutline, EditOutlined, ErrorOutline } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import type { ComponentType } from 'react';

import { useGetReportByShiftQuery } from '~/services/report/report.queries';
import type { Shift } from '~/services/shift/shift.types';
import { ReportStatus } from '~/services/report/report.types';
import { formatTime } from '~/utils/date';
import { toTitleCase } from '~/utils/textUtils';

import { ReportStatusChip } from './StatusChip';

type ShiftCardProps = {
  shift: Shift;
  tenantId: string;
  shiftDate: string;
  isSelected: boolean;
  onClick: (shift: Shift) => void;
};

type ReportStatusMapItem = {
  color: 'warning' | 'success' | 'error' | 'info';
  icon: ComponentType;
};

const reportStatusMap: Record<ReportStatus, ReportStatusMapItem> = {
  [ReportStatus.DRAFT]: { color: 'warning', icon: EditOutlined },
  [ReportStatus.SUBMITTED]: { color: 'success', icon: CheckCircleOutline },
  [ReportStatus.VALIDATED]: { color: 'info', icon: CheckCircleOutline },
};

export const ShiftCard = ({ shift, tenantId, shiftDate, isSelected, onClick }: ShiftCardProps) => {
  const { data: report } = useGetReportByShiftQuery({
    tenantId,
    shiftId: shift.id,
    shiftDate,
  });

  return (
    <Stack
      onClick={() => onClick(shift)}
      p={2}
      bgcolor={isSelected ? 'background.paper': 'background.surface'}
      borderRadius={2}
      border="1px solid"
      borderColor={isSelected ? 'primary.alpha' : 'transparent'}
      sx={{ transition: 'all 0.2s' }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body1" fontWeight={600}>
          {shift.name} Shift
        </Typography>

        <ReportStatusChip
          icon={report ? reportStatusMap[report.status].icon : ErrorOutline}
          label={report ? toTitleCase(report.status) : 'No Report'}
          color={report ? reportStatusMap[report.status].color : 'error'}
        />
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {formatTime(shift.shiftStart as unknown as string)} —{' '}
        {formatTime(shift.shiftEnd as unknown as string)}
      </Typography>
    </Stack>
  );
};
