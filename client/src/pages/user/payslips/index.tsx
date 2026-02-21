import { Chip, List, Stack, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState, useEffect } from 'react';

import {
  CardContainer,
  DateRangePicker,
  NoData,
  PageLayout,
  SkeletonList,
  type DateRange,
} from '~/components/ui';
import { useAuthContext } from '~/context/auth/useAuthContext';
import { getInitialDateRange } from '~/utils/date';
import { useDisclosure } from '~/hooks/useDisclosure';
import { ViewPayslipModal } from '~/pages/admin/payroll/ViewPayslipModal';
import { type Payslip } from '~/services/payroll/payroll.types';
import { useGetPayslipsQuery } from '~/services/payroll/payroll.queries';
import { getPaymentStatusColor } from '~/pages/admin/payroll/utils';
import { formatCurrency } from '~/utils/number';

const PAYSLIPS_KEY = 'payslipsRange';

export const PayslipsPage = () => {
  const { auth } = useAuthContext();
  const initialRange = useMemo(
    () =>
      getInitialDateRange(PAYSLIPS_KEY, {
        start: dayjs().startOf('month'),
        end: dayjs().endOf('month'),
      }),
    [],
  );

  const [startDate, setStartDate] = useState<Dayjs | null>(initialRange.startDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialRange.endDate);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const payslipDisclosure = useDisclosure();

  const { data: payslips, isLoading } = useGetPayslipsQuery({
    tenantId: auth?.tenantId ?? '',
    userId: auth?.id,
    periodStart: startDate?.utc().toISOString(),
    periodEnd: endDate?.utc().toISOString(),
  });

  useEffect(() => {
    if (startDate && endDate) {
      sessionStorage.setItem(
        PAYSLIPS_KEY,
        JSON.stringify({
          start: startDate.utc().toISOString(),
          end: endDate.utc().toISOString(),
        }),
      );
    }
  }, [startDate, endDate]);

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

  const handleCardClick = (payslip: Payslip) => {
    setSelectedPayslip(payslip);
    payslipDisclosure.onOpen();
  };

  return (
    <PageLayout>
      <Stack spacing={2} p={2} bgcolor="background.default" flex={1}>
        <Stack spacing={1}>
          <Typography variant="body2">Select Period:</Typography>
          <DateRangePicker
            selectedStart={startDate}
            selectedEnd={endDate}
            onAccept={handleSelectDateRange}
          />
        </Stack>

        <List>
          {isLoading ? (
            <SkeletonList height={72} rows={3} />
          ) : (
            <Stack spacing={1}>
              {payslips?.length === 0 && <NoData text="No payslips found" />}
              {payslips?.map((payslip) => (
                <CardContainer
                  key={payslip.id}
                  spacing={1}
                  onClick={() => handleCardClick(payslip)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(payslip.periodStart).format('MMM D')} –{' '}
                        {dayjs(payslip.periodEnd).format('MMM D, YYYY')}
                      </Typography>
                      <Chip
                        size="small"
                        label={payslip.paymentStatus}
                        variant="outlined"
                        color={getPaymentStatusColor(payslip.paymentStatus)}
                      />
                    </Stack>
                    <Stack alignItems="flex-end">
                      <Typography variant="body2" color="text.secondary">
                        Net Pay
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatCurrency(parseFloat(payslip.totalCompensation))}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContainer>
              ))}
            </Stack>
          )}
        </List>

        <ViewPayslipModal
          open={payslipDisclosure.open}
          onClose={payslipDisclosure.onClose}
          payslip={selectedPayslip}
        />
      </Stack>
    </PageLayout>
  );
};
